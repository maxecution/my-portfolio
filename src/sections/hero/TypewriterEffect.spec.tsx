import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TypewriterEffect from './TypewriterEffect';

jest.useFakeTimers();

describe('TypeWriterEffect Component', () => {
  const phrases = ['Hello', 'World'];

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Component Rendering', () => {
    test('renders cursor element correctly', () => {
      render(<TypewriterEffect phrases={phrases} />);

      const cursor = document.querySelector('.animate-cursor-blink');
      expect(cursor).toBeVisible();
    });
  });

  describe('Typewriter Animation', () => {
    test('types and deletes phrases correctly', () => {
      render(<TypewriterEffect phrases={phrases} typingSpeed={50} deletingSpeed={25} delayBetweenPhrases={1000} />);

      // Initial state - empty text with cursor
      let container = screen.getByText('Typewriter effect: Hello, World').parentElement;
      expect(container).toBeVisible();

      const getVisibleText = () => document.querySelector('span[aria-hidden="true"]') as HTMLElement;

      // Types first phrase "Hello" character by character
      for (let i = 0; i < phrases[0].length; i++) {
        act(() => {
          jest.advanceTimersByTime(50);
        });
        container = getVisibleText();
        expect(container?.textContent).toBe(phrases[0].substring(0, i + 1));
      }

      // Pause after typing (delayBetweenPhrases)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      //  Deleting "Hello"
      for (let i = phrases[0].length; i > 0; i--) {
        act(() => {
          jest.advanceTimersByTime(25);
        });
        container = getVisibleText();
        const expected = i - 1 > 0 ? phrases[0].substring(0, i - 1) : '\u00A0';
        expect(container?.textContent).toBe(expected);
      }

      // Types second phrase "World" character by character immediately after deleting first phrase
      for (let i = 0; i < phrases[1].length; i++) {
        act(() => {
          jest.advanceTimersByTime(50);
        });
        container = getVisibleText();
        expect(container?.textContent).toBe(phrases[1].substring(0, i + 1));
      }
    });

    test('handles default empty phrases array', () => {
      render(<TypewriterEffect />);

      expect(screen.getByText('Typewriter effect:')).toBeInTheDocument();
      const container = document.querySelector('span[aria-hidden="true"]') as HTMLElement;
      expect(container?.textContent).toBe('\u00A0');
    });
  });

  describe('Accessibility Features', () => {
    test('provides proper accessibility structure', () => {
      render(<TypewriterEffect phrases={phrases} />);

      // Should have both sr-only text and aria-hidden animation
      const srText = screen.getByText('Typewriter effect: Hello, World');
      expect(srText).toBeVisible();
      expect(srText).toHaveClass('sr-only');

      const cursor = document.querySelector('.animate-cursor-blink');
      expect(cursor).toBeVisible();
      const visible = document.querySelector('span[aria-hidden="true"]');
      expect(visible).toBeVisible();
    });
  });
});
