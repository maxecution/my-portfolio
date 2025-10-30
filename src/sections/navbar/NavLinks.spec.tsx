import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavLinks from './NavLinks';
import type { NavLink } from '@data/navbar/NavBar.data';

describe('NavLinks', () => {
  const mockLinks: NavLink[] = [
    { href: '#', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ];

  const mockOnLinkClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('should render all links with correct content and attributes, and render horizontal by default', () => {
      render(<NavLinks links={mockLinks} />);

      mockLinks.forEach((link) => {
        const linkElement = screen.getByRole('link', { name: `Navigate to ${link.label} section` });
        expect(linkElement).toBeVisible();
        expect(linkElement).toHaveAttribute('href', link.href);
        expect(linkElement).toHaveTextContent(link.label);
        expect(linkElement).toHaveAttribute('aria-label', `Navigate to ${link.label} section`);
      });

      const list = screen.getByRole('list');
      expect(list).toHaveClass('flex-row', 'items-center');
      expect(list).not.toHaveClass('flex-col', 'space-y-6');
    });

    test('should render vertical layout when specified', () => {
      render(<NavLinks links={mockLinks} orientation='vertical' />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('flex-col', 'space-y-4');
      expect(list).not.toHaveClass('flex-row', 'items-center');

      // Vertical layout should have border styling on list items
      const listLinks = screen.getAllByRole('link');
      expect(listLinks).toHaveLength(4);
      listLinks.forEach((item) => {
        expect(item).toHaveClass('text-muted-foreground', 'border-b', 'border-foreground', 'hover:border-primary-400');
      });
    });
  });

  describe('interactions', () => {
    test('should call onLinkClick when a link is clicked', () => {
      render(<NavLinks links={mockLinks} onLinkClick={mockOnLinkClick} />);

      const firstLink = screen.getByRole('link', { name: 'Navigate to About section' });
      fireEvent.click(firstLink);

      expect(mockOnLinkClick).toHaveBeenCalledTimes(1);
    });

    test('should work without onLinkClick prop', () => {
      // Should not throw when onLinkClick is not provided
      expect(() => {
        render(<NavLinks links={mockLinks} />);
        const firstLink = screen.getByRole('link', { name: 'Navigate to About section' });
        fireEvent.click(firstLink);
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    test('should handle empty links array', () => {
      render(<NavLinks links={[]} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
    });
  });
});
