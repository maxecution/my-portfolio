import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from './About';
import { aboutData, attributes } from '@data/about/About.data';
import { authorData } from '@data/page/Page.data';

describe('About Component', () => {
  const listeners: Record<string, ((e: MediaQueryListEvent) => void)[]> = {};
  let observeCallback: IntersectionObserverCallback;

  function dispatchChange(matches: boolean) {
    (listeners['change'] ?? []).forEach((cb) => cb({ matches } as MediaQueryListEvent));
  }

  beforeEach(() => {
    window.IntersectionObserver = jest.fn(function (callback: IntersectionObserverCallback) {
      observeCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
      };
    });

    for (const key in listeners) delete listeners[key];

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: (event: string, cb: (e: MediaQueryListEvent) => void) => {
          if (!listeners[event]) listeners[event] = [];
          listeners[event].push(cb);
        },
        removeEventListener: (event: string, cb: (e: MediaQueryListEvent) => void) => {
          listeners[event] = listeners[event]?.filter((x) => x !== cb) ?? [];
        },
      })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Section Header', () => {
    test('should render the section header text', () => {
      render(<About />);
      expect(screen.getByText(aboutData.sectionHeader!)).toBeVisible();
    });
  });

  describe('Intro Card', () => {
    test('should render full name from authorData', () => {
      render(<About />);
      expect(screen.getByText(authorData.firstName!)).toBeVisible();
      expect(screen.getByText(authorData.lastName!)).toBeVisible();
    });

    test('should render job title pill', () => {
      render(<About />);
      expect(screen.getByText(authorData.jobTitle!)).toBeVisible();
    });

    test('should render developer level pill with calculated tenure', () => {
      render(<About />);
      const currentYear = new Date().getFullYear();
      const startYear = new Date('2024-7-15').getFullYear();
      const tenure = currentYear - startYear;
      expect(screen.getByText(`Level ${tenure} Developer`)).toBeVisible();
    });

    test('should render both intro paragraphs', () => {
      render(<About />);
      expect(screen.getByText(aboutData.introCard.paragraph1!)).toBeVisible();
      expect(screen.getByText(aboutData.introCard.paragraph2!)).toBeVisible();
    });
  });

  describe('Attributes Grid', () => {
    test('should render all attribute cards from data', () => {
      render(<About />);
      attributes.forEach((attribute) => {
        expect(screen.getByText(attribute.name)).toBeVisible();
      });
    });

    test('should render correct number of FlipCards', () => {
      const { container } = render(<About />);
      const flipCards = container.querySelectorAll('button');
      expect(flipCards).toHaveLength(attributes.length);
    });
  });

  describe('FlipCard Functionality', () => {
    test('should initially render front content for all cards', () => {
      render(<About />);
      // Front content shows "Click to reveal"
      const revealTexts = screen.getAllByText('Click to reveal');
      expect(revealTexts).toHaveLength(attributes.length);
    });

    test('should flip card and show back content when clicked, and flip back when clicked again', async () => {
      const { container } = render(<About />);

      const cardButtons = container.querySelectorAll('button');
      const firstButton = cardButtons[0] as HTMLElement;

      // Initially not flipped
      expect(firstButton).not.toHaveClass('transform-[rotateY(180deg)]');

      // Back content should have aria-hidden=true when not flipped
      const backContent = screen.getByText(attributes[0].description).closest('[aria-hidden]');
      expect(backContent).toHaveAttribute('aria-hidden', 'true');

      fireEvent.click(firstButton);

      // Should now be flipped
      await waitFor(() => {
        expect(firstButton).toHaveClass('transform-[rotateY(180deg)]');
      });

      // Back content should now have aria-hidden=false
      expect(backContent).toHaveAttribute('aria-hidden', 'false');

      fireEvent.click(firstButton);

      // Should hide back again
      expect(backContent).toHaveAttribute('aria-hidden', 'true');
    });

    test('should only show one flipped card at a time', async () => {
      const { container } = render(<About />);

      const buttons = Array.from(container.querySelectorAll('button')) as HTMLElement[];

      // Click first card to flip it
      fireEvent.click(buttons[0]);
      await waitFor(() => {
        expect(buttons[0]).toHaveClass('transform-[rotateY(180deg)]');
      });

      // Click second card - first should unflip
      fireEvent.click(buttons[1]);
      await waitFor(() => {
        expect(buttons[1]).toHaveClass('transform-[rotateY(180deg)]');
        expect(buttons[0]).not.toHaveClass('transform-[rotateY(180deg)]');
      });
    });

    test('should handle flipping same card multiple times', async () => {
      const { container } = render(<About />);

      act(() => {
        observeCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
      });

      const cardButton = screen.getAllByRole('button')[0];

      // First flip to back
      fireEvent.click(cardButton);
      await waitFor(() => {
        const button = container.querySelectorAll('button')[0];
        expect(button).toHaveClass('transform-[rotateY(180deg)]');
      });

      // Flip back to front
      fireEvent.click(cardButton);
      await waitFor(() => {
        const button = container.querySelectorAll('button')[0];
        expect(button).not.toHaveClass('transform-[rotateY(180deg)]');
      });

      // Flip to back again
      fireEvent.click(cardButton);
      await waitFor(() => {
        const button = container.querySelectorAll('button')[0];
        expect(button).toHaveClass('transform-[rotateY(180deg)]');
      });
    });
  });

  describe('IntersectionObserver', () => {
    test('should observe the grid ref on mount', () => {
      render(<About />);
      expect(window.IntersectionObserver).toHaveBeenCalled();
    });

    test('should hide About section after intersection out when not mobile', async () => {
      render(<About />);

      // Default Desktop View
      // Intersection IN
      act(() => {
        observeCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
      });

      const cardTitle = screen.getByText(attributes[0].name);
      const wrapper = cardTitle.closest('div[aria-hidden][class*="transition-opacity"]');

      // Section becomes visible
      expect(wrapper).toHaveAttribute('aria-hidden', 'false');

      // Intersection OUT
      act(() => {
        observeCallback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
      });

      // Section should now be hidden
      await waitFor(() => {
        expect(wrapper).toHaveAttribute('aria-hidden', 'true');
        expect(wrapper).toHaveClass('opacity-0');
      });
    });

    test('keeps About section visible after intersection out when mobile', async () => {
      render(<About />);

      // Mobile View
      act(() => {
        dispatchChange(true);
      });

      // Intersection IN
      act(() => {
        observeCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
      });

      const cardTitle = screen.getByText(attributes[0].name);
      const wrapper = cardTitle.closest('div[aria-hidden][class*="transition-opacity"]');

      // Section becomes visible
      expect(wrapper).toHaveAttribute('aria-hidden', 'false');

      // Intersection OUT
      act(() => {
        observeCallback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
      });

      // Section should stay visible
      await waitFor(() => {
        expect(wrapper).toHaveAttribute('aria-hidden', 'false');
        expect(wrapper).toHaveClass('opacity-100');
      });
    });

    test('should disconnect observer on unmount', () => {
      const mockDisconnect = jest.fn();
      window.IntersectionObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        disconnect: mockDisconnect,
        unobserve: jest.fn(),
      }));

      const { unmount } = render(<About />);
      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('Proficiency Bonus Section', () => {
    test('should render proficiency bonus with calculated value', () => {
      render(<About />);

      const currentYear = new Date().getFullYear();
      const startYear = new Date('2024-7-15').getFullYear();
      const tenure = currentYear - startYear;
      const proficiencyBonus = Math.ceil(tenure / 4) + 1;

      expect(screen.getByText(/Proficiency Bonus:/)).toBeVisible();
      expect(screen.getByText(`+${proficiencyBonus} to all web development checks`, { exact: false })).toBeVisible();
    });
  });
});
