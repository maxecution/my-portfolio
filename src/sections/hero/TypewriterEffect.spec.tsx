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

      const cursor = screen.getByText('|');
      expect(cursor).toBeVisible();
      expect(cursor).toHaveClass('animate-cursor-blink');
    });

    test('applies custom className correctly', () => {
      const customClass = 'custom-typewriter-class';
      render(<TypewriterEffect phrases={phrases} className={customClass} />);

      const ariaHiddenSpan = screen.getByText('|').parentElement;
      expect(ariaHiddenSpan).toHaveClass(customClass);
    });
  });

  describe('Typewriter Animation', () => {
    test('types and deletes phrases correctly', () => {
      render(<TypewriterEffect phrases={phrases} typingSpeed={50} deletingSpeed={25} delayBetweenPhrases={1000} />);

      // Initial state - empty text with cursor
      let container = screen.getByText('|').parentElement;
      expect(container).toBeVisible();

      // Types first phrase "Hello" character by character
      for (let i = 0; i < phrases[0].length; i++) {
        act(() => {
          jest.advanceTimersByTime(50);
        });
        container = screen.getByText('|').parentElement;
        expect(container?.textContent).toBe(phrases[0].substring(0, i + 1) + '|');
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
        container = screen.getByText('|').parentElement;
        expect(container?.textContent).toBe(phrases[0].substring(0, i - 1) + '|');
      }

      // Types second phrase "World" character by character immediately after deleting first phrase
      for (let i = 0; i < phrases[1].length; i++) {
        act(() => {
          jest.advanceTimersByTime(50);
        });
        container = screen.getByText('|').parentElement;
        expect(container?.textContent).toBe(phrases[1].substring(0, i + 1) + '|');
      }
    });

    test('handles empty phrases array', () => {
      render(<TypewriterEffect phrases={[]} />);

      const container = screen.getByText('|').parentElement;
      expect(container?.textContent).toBe('|');
    });
  });

  describe('Accessibility Features', () => {
    test('provides proper accessibility structure', () => {
      render(<TypewriterEffect phrases={phrases} />);

      // Should have both sr-only text and aria-hidden animation
      const srText = screen.getByText('Typewriter effect: Hello, World');
      expect(srText).toBeVisible();
      expect(srText).toHaveClass('sr-only');

      const cursor = screen.getByText('|');
      expect(cursor).toBeVisible();
      expect(cursor.parentElement).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
