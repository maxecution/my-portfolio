import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from './NavBar';

// Mocking ThemeToggleButton to avoid Theme Provider Context error
jest.mock('./ThemeToggleButton', () => {
  return function MockThemeToggleButton() {
    return <button aria-label='Theme toggle button'>Theme Toggle</button>;
  };
});

// Mock scroll state hook
jest.mock('@hooks/useScrollState');
import useScrollState from '@hooks/useScrollState'; // import after mocking
const mockUseScrollState = useScrollState as jest.MockedFunction<typeof useScrollState>;

// Mock data using shared mock structure
jest.mock('@data/navbar/NavBar.data', () => ({
  navLinks: [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ],
  navIcon: {
    initials: 'MZS',
    firstName: 'Max',
    lastName: 'Zimmer-Smith',
  },
}));

describe('NavBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseScrollState.mockReturnValue(false);
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('rendering', () => {
    test('should render logo with correct content and accessibility', () => {
      render(<NavBar />);

      const logoLink = screen.getByRole('link', { name: 'Navigate to Home section' });
      expect(logoLink).toBeVisible();
      expect(logoLink).toHaveAttribute('href', '#');
      expect(logoLink).toHaveAttribute('aria-label', 'Navigate to Home section');
      expect(logoLink).toHaveAttribute('title', 'Navigate to Home section');

      // Check logo content
      expect(screen.getByText('MZS')).toBeVisible();
      expect(screen.getByText('Max')).toBeVisible();
      expect(screen.getByText('Zimmer-Smith')).toBeVisible();
    });

    test('should render all navigation components with relevant style classes', () => {
      render(<NavBar />);

      expect(screen.getByRole('link', { name: 'Navigate to About section' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Theme toggle button' })).toBeInTheDocument();

      // Should render navigation menu with links (horizontal desktop navigation)
      const navMenu = screen.getByRole('list');
      expect(navMenu).toHaveClass('flex-row', 'items-center');

      // Desktop navigation should be hidden on mobile, visible on desktop
      expect(navMenu.parentElement).toHaveClass('hidden', 'md:flex');

      // Should render burger menu button for mobile
      const burgerButton = screen.getByRole('button', { name: 'Open navigation menu' });
      expect(burgerButton).toBeInTheDocument();

      // Mobile navigation should be visible on mobile, hidden on desktop
      expect(burgerButton.parentElement).toHaveClass('md:hidden');
    });
  });

  describe('scroll state integration', () => {
    test('should apply transparent background when not scrolled', () => {
      render(<NavBar />);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-transparent');
      expect(header).not.toHaveClass('bg-background-200/75', 'dark:bg-background-200/75', 'backdrop-blur-xs');
    });

    test('should apply blurred background when scrolled and pass hasScrolled state to BurgerMenu', () => {
      mockUseScrollState.mockReturnValue(true);
      render(<NavBar />);

      // Test that scroll state affects the header background
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-card/75', 'backdrop-blur-md', 'shadow-lg', 'shadow-primary/20');

      // Test that burger menu behaves correctly with scroll state by opening it
      const burgerButton = screen.getByRole('button', { name: 'Open navigation menu' });
      fireEvent.click(burgerButton);

      // When scrolled, the mobile menu should have the blurred background
      const mobileMenu = document.querySelector('[data-burger-menu]');
      expect(mobileMenu).toHaveClass('bg-card/75', 'backdrop-blur-md', 'shadow-md', 'shadow-primary/20');
    });
  });
});
