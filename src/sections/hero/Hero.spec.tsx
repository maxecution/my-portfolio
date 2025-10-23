import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from './Hero';

// Mock hero data to ensure consistent testing
jest.mock('@/data/hero/Hero.data', () => ({
  heroData: {
    name: 'User',
    text: 'Test description text for the hero section',
    typewriterPhrases: ['Frontend Developer', 'React Specialist', 'TypeScript Advocate'],
  },
}));

// Importing the now mocked heroData
import { heroData } from '@/data/hero/Hero.data';
const HERO_CONSTANTS = {
  H1: "Hi, I'm " + heroData.name,
  TEXT: heroData.text,
  SR_TYPEWRITER: `Typewriter effect: ${heroData.typewriterPhrases.join(', ')}`,
};
const { H1, TEXT, SR_TYPEWRITER } = HERO_CONSTANTS;

jest.mock('@hooks/useScrollState');
import useScrollState from '@hooks/useScrollState'; // importing after mocking
const mockUseScrollState = useScrollState as jest.MockedFunction<typeof useScrollState>;

describe('Hero Component', () => {
  beforeEach(() => {
    mockUseScrollState.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders the Hero component with correct heading, including gradient effect, and description', () => {
      render(<Hero />);

      // Check the heading
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeVisible();
      expect(heading).toHaveClass('text-5xl', 'md:text-7xl', 'tracking-tight', 'font-medium');
      expect(heading).toHaveTextContent(H1);

      // The gradient text should be a span with the appropriate gradient classes
      const gradientSpan = heading.querySelector('span');
      expect(gradientSpan).toBeVisible();
      expect(gradientSpan).toHaveClass('bg-gradient-to-r', 'bg-clip-text', 'text-transparent', 'animate-gradient');

      // Check the description
      const description = screen.getByText(TEXT);
      expect(description).toBeVisible();
      expect(description).toHaveClass('text-xl', 'md:text-2xl', 'max-w-2xl', 'mx-auto', 'text-text-600', 'font-normal');
    });
  });

  describe('TypewriterEffect Integration', () => {
    test('TypewriterEffect displays content and structure', () => {
      render(<Hero />);

      // TypewriterEffect should render both sr-only text and aria-hidden animation
      const srOnlyText = screen.getByText(SR_TYPEWRITER);
      expect(srOnlyText).toHaveClass('sr-only');

      // Find the cursor and verify it's in an aria-hidden span
      const cursor = screen.getByText('|');
      const ariaHiddenSpan = cursor.parentElement;
      expect(ariaHiddenSpan).toHaveAttribute('aria-hidden', 'true');

      // Should contain the cursor with proper animation class
      expect(cursor).toHaveClass('animate-cursor-blink');
    });

    test('calculates width based on longest phrase in heroData', () => {
      render(<Hero />);

      // Find the typewriter container span that has the width style
      const cursor = screen.getByText('|');
      const typewriterContainer = cursor.closest('span[style]'); // The span with width style

      // The longest phrase "TypeScript Advocate" has 19 characters
      // 19 * 0.6 = 11.4em expected width
      expect(typewriterContainer).toHaveStyle({ width: '11.4em' });
    });
  });

  describe('Arrow Component Integration', () => {
    test('renders arrow container with correct positioning and styling when not scrolled', () => {
      render(<Hero />);

      // Find the arrow container div (parent of the link containing the arrow)
      const arrowLink = screen.getByRole('link');
      const arrowContainer = arrowLink.parentElement;
      expect(arrowContainer).toHaveClass(
        'absolute',
        'bottom-0',
        'left-1/2',
        'transform',
        '-translate-x-1/2',
        'transition-all',
        'duration-700',
        'ease-in-out',
        'opacity-100',
        'visible',
        'animate-bounce'
      );
      expect(arrowContainer).toHaveAttribute('aria-hidden', 'false');
    });

    test('hides arrow when scrolled past threshold', () => {
      mockUseScrollState.mockReturnValue(true);
      render(<Hero />);

      // When scrolled, find the arrow container by link and then parent div
      // The SVG becomes inaccessible when aria-hidden="true" is on the parent
      const arrowLink = screen.getByRole('link', { hidden: true });
      const arrowContainer = arrowLink.parentElement;
      expect(arrowContainer).toHaveClass('opacity-0', 'invisible');
      expect(arrowContainer).not.toHaveClass('animate-bounce', 'opacity-100', 'visible');
    });

    test('Arrow re-appears correctly when scroll state changes', () => {
      const { rerender } = render(<Hero />);

      // Initially not scrolled
      rerender(<Hero />);

      const arrowLink = screen.getByRole('link');
      const arrowContainer = arrowLink.parentElement;
      expect(arrowContainer).toHaveClass('opacity-100', 'visible');

      // Then scrolled - arrow link becomes hidden
      mockUseScrollState.mockReturnValue(true);
      rerender(<Hero />);

      expect(arrowContainer).toHaveClass('opacity-0', 'invisible');
      expect(arrowContainer).toHaveAttribute('aria-hidden', 'true');

      // Finally back to not scrolled - arrow link visible again
      mockUseScrollState.mockReturnValue(false);
      rerender(<Hero />);

      expect(arrowContainer).toHaveClass('opacity-100', 'visible');
      expect(arrowContainer).toHaveAttribute('aria-hidden', 'false');
    });
  });
});
