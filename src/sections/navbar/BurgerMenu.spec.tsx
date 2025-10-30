import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import BurgerMenu from './BurgerMenu';
import type { NavLink } from '@data/navbar/NavBar.data';

describe('BurgerMenu', () => {
  const listeners: Record<string, ((e: MediaQueryListEvent) => void)[]> = {};

  beforeEach(() => {
    // Reset listeners
    for (const key in listeners) delete listeners[key];

    // Mock matchMedia properly
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: (event: string, callback: (e: MediaQueryListEvent) => void) => {
          if (!listeners[event]) listeners[event] = [];
          listeners[event].push(callback);
        },
        removeEventListener: (event: string, callback: (e: MediaQueryListEvent) => void) => {
          if (listeners[event]) {
            listeners[event] = listeners[event].filter((cb) => cb !== callback);
          }
        },
        dispatchEvent: jest.fn(),
      })),
    });
  });

  const mockLinks: NavLink[] = [
    { href: '#', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ];

  describe('burger button', () => {
    test('should render button with correct accessibility and toggle behavior', () => {
      render(<BurgerMenu navLinks={mockLinks} hasScrolled={false} />);

      const button = screen.getByRole('button', { name: 'Open navigation menu' });
      expect(button).toBeVisible();
      expect(button).toHaveAttribute('aria-controls', 'mobile-menu');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      // Should have 3 hamburger lines
      expect(button.querySelectorAll('span')).toHaveLength(3);

      // Test toggle functionality
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-label', 'Close navigation menu');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(document.querySelector('[data-burger-menu]')).toBeVisible();

      // Test close
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(document.querySelector('[data-burger-menu]')).not.toBeInTheDocument();
    });

    test('should apply correct icon transforms when open', () => {
      render(<BurgerMenu navLinks={mockLinks} hasScrolled={false} />);

      const button = screen.getByRole('button');
      const lines = button.querySelectorAll('span');

      // Initially no transforms
      expect(lines[0]).not.toHaveClass('rotate-45');
      expect(lines[1]).not.toHaveClass('opacity-0');

      fireEvent.click(button);

      // When open, should have transform classes
      expect(lines[0]).toHaveClass('rotate-45', 'translate-y-2');
      expect(lines[1]).toHaveClass('opacity-0');
      expect(lines[2]).toHaveClass('-rotate-45', '-translate-y-2');
    });
  });

  describe('menu rendering', () => {
    test('should render menu with correct background based on scroll state', () => {
      const { rerender } = render(<BurgerMenu navLinks={mockLinks} hasScrolled={false} />);

      fireEvent.click(screen.getByRole('button'));
      const menu = document.querySelector('[data-burger-menu]');

      // Not scrolled - solid background
      expect(menu).toHaveClass('bg-background');

      // Scrolled - blurred background
      rerender(<BurgerMenu navLinks={mockLinks} hasScrolled={true} />);
      expect(menu).toHaveClass('bg-card/75', 'backdrop-blur-md', 'shadow-md', 'shadow-primary/20');
    });

    test('should render NavLinks with correct structure and handle link clicks', () => {
      render(<BurgerMenu navLinks={mockLinks} hasScrolled={false} />);

      fireEvent.click(screen.getByRole('button'));

      // Should render all nav items as links
      const navLinks = screen.getAllByRole('link');

      expect(navLinks).toHaveLength(4);
      expect(navLinks[0]).toHaveAttribute('href', '#');
      expect(navLinks[1]).toHaveAttribute('href', '#about');

      // Clicking a nav link should close menu
      fireEvent.click(navLinks[1]);
      expect(document.querySelector('[data-burger-menu]')).not.toBeInTheDocument();
    });
  });

  describe('menu auto closing', () => {
    test('should close menu when clicking outside but not when clicking menu or button', () => {
      render(<BurgerMenu navLinks={mockLinks} hasScrolled={false} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      const menu = document.querySelector('[data-burger-menu]');

      // Should not close when clicking menu itself
      act(() => fireEvent.mouseDown(menu!));
      expect(menu).toBeVisible();

      // Should not close when clicking button
      act(() => fireEvent.mouseDown(button));
      expect(menu).toBeVisible();

      // Should close when clicking outside
      act(() => fireEvent.mouseDown(document.body));
      expect(menu).not.toBeInTheDocument();
    });

    test('should close menu when viewport resizes to above mobile breakpoint', async () => {
      render(<BurgerMenu navLinks={mockLinks} hasScrolled={false} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      const menu = document.querySelector('[data-burger-menu]');
      expect(menu).toBeVisible();

      act(() => {
        listeners['change'].forEach((cb) => cb({ matches: true } as MediaQueryListEvent));
        listeners['change'].forEach((cb) => cb({ matches: false } as MediaQueryListEvent));
        // Menu should still be closed even after moving back into mobile viewport
      });

      expect(menu).not.toBeInTheDocument();
    });
  });

  describe('cleanup and edge cases', () => {
    test('should clean up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = render(<BurgerMenu navLinks={mockLinks} hasScrolled={false} />);
      fireEvent.click(screen.getByRole('button')); // Open menu to trigger listener

      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    test('should handle empty navLinks and rapid toggling', () => {
      // Test empty links first
      render(<BurgerMenu navLinks={[]} hasScrolled={false} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      const menu = document.querySelector('[data-burger-menu]');
      expect(menu).toBeVisible();
      expect(screen.queryAllByRole('menuitem')).toHaveLength(0);

      fireEvent.click(button); // Close
      fireEvent.click(button); // Open
      fireEvent.click(button); // Close
      fireEvent.click(button); // Open
      fireEvent.click(button); // Close

      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(menu).not.toBeInTheDocument();
    });
  });
});
