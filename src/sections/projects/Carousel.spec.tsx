import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ProjectCardDetails } from '@data/projects/Projects.data';
import Carousel from './Carousel';

const resizeObservers: MockResizeObserver[] = [];

class MockResizeObserver {
  private cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
    resizeObservers.push(this);
  }
  observe(target: Element): void {
    void target;
  }
  disconnect = jest.fn();
  trigger(): void {
    this.cb([], this as unknown as ResizeObserver);
  }
}

(window as unknown as { ResizeObserver?: typeof MockResizeObserver }).ResizeObserver = MockResizeObserver;

let rafId = 0;
const rafCallbacks = new Map<number, FrameRequestCallback>();
window.requestAnimationFrame = (cb: FrameRequestCallback) => {
  rafId += 1;
  rafCallbacks.set(rafId, cb);
  setTimeout(() => {
    const fn = rafCallbacks.get(rafId);
    if (fn) fn(performance.now());
  }, 0);
  return rafId;
};
window.cancelAnimationFrame = (id: number) => {
  rafCallbacks.delete(id);
};

// getComputedStyle mock
const originalGetComputedStyle = window.getComputedStyle;
const getComputedStyleMock: jest.SpyInstance = jest
  .spyOn(window, 'getComputedStyle')
  .mockImplementation((el: Element) => {
    const style = originalGetComputedStyle(el);
    return { ...style, gap: '6px', columnGap: '' } as CSSStyleDeclaration;
  });

jest.mock('./ProjectCard', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid='project-card'>{title}</div>,
}));

const pauseMock = jest.fn();
const resumeMock = jest.fn();
let autoplayTick: (() => void) | null = null;

jest.mock('@hooks/useAutoplay', () => ({
  __esModule: true,
  useAutoplay: jest.fn().mockImplementation((cb: () => void) => {
    autoplayTick = cb;
    return { pause: pauseMock, resume: resumeMock };
  }),
}));

const data: ProjectCardDetails[] = [
  {
    title: 'Portfolio Website',
    description: 'A personal portfolio website to showcase my projects and skills.',
    techStack: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Jest',
      'GitHub',
      'Vercel',
      'more',
      'technologies',
      'to',
      'demonstrate',
      'the',
      'scrolling',
      'effect',
      'and',
      'layout',
      'handling',
      'capabilities',
    ],
    image: '/images/portfolio.png',
    githubUrl: 'https://github.com/maxecution/my-portfolio/',
    liveUrl: 'https://maxecution.github.io/portfolio-website/',
    difficulty: 'Medium',
  },
  {
    title: 'Portfolio Website 2',
    description: 'A personal portfolio website to showcase my projects and skills.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    image: '/images/portfolio.png',
    githubUrl: 'https://github.com/maxecution/my-portfolio/',
    liveUrl: 'https://maxecution.github.io/portfolio-website/',
    difficulty: 'Medium',
  },
  {
    title: 'Portfolio Website 3',
    description: 'A personal portfolio website to showcase my projects and skills.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Jest'],
    image: '/images/portfolio.png',
    githubUrl: 'https://github.com/maxecution/my-portfolio/',
    liveUrl: 'https://maxecution.github.io/portfolio-website/',
    difficulty: 'Hard',
  },
  {
    title: 'Portfolio Website 4',
    description: 'A personal portfolio website to showcase my projects and skills.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Jest', 'Vercel'],
    image: '/images/portfolio.png',
    githubUrl: 'https://github.com/maxecution/my-portfolio/',
    liveUrl: 'https://maxecution.github.io/portfolio-website/',
    difficulty: 'Legendary',
  },
  {
    title: 'Portfolio Website 5',
    description: 'A personal portfolio website to showcase my projects and skills.',
    techStack: ['React', 'TypeScript'],
    image: '/images/portfolio.png',
    githubUrl: 'https://github.com/maxecution/my-portfolio/',
    liveUrl: 'https://maxecution.github.io/portfolio-website/',
    difficulty: 'Unknown',
  },
];

function getCarouselRegion() {
  return screen.getByRole('region', { name: 'Projects carousel' }) as HTMLDivElement;
}

function getLastResizeObserver() {
  return resizeObservers[resizeObservers.length - 1];
}

const user = userEvent.setup();

describe('Carousel Component', () => {
  beforeAll(() => {
    // PointerEvent polyfill
    if (!(window as { PointerEvent?: unknown }).PointerEvent) {
      (window as unknown as { PointerEvent: typeof Event }).PointerEvent = class extends Event {
        constructor(type: string, props: PointerEventInit = {}) {
          super(type, props as EventInit);
          const define = (name: string, value: unknown) => {
            Object.defineProperty(this, name, { value, configurable: true, enumerable: true });
          };
          define('pointerType', props.pointerType ?? 'mouse');
          define('pointerId', props.pointerId ?? 1);
          define('clientX', props.clientX ?? 0);
          define('clientY', props.clientY ?? 0);
          define('buttons', props.buttons ?? 0);
          define('pressure', props.pressure ?? 0);
        }
      } as typeof Event;
    }

    // scrollTo mock
    if (!HTMLElement.prototype.scrollTo) {
      HTMLElement.prototype.scrollTo = function (opts?: ScrollToOptions | number, y?: number) {
        if (typeof opts === 'object' && opts !== null) {
          this.scrollLeft = opts.left ?? 0;
        } else if (typeof opts === 'number') {
          this.scrollLeft = opts;
        }
        void y;
      };
    }
  });

  beforeEach(() => {
    pauseMock.mockClear();
    resumeMock.mockClear();
    window.innerWidth = 1440; // desktop
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering and ARIA', () => {
    test('renders carousel with correct ARIA attributes, cards, and dots', () => {
      render(<Carousel data={data} />);
      const region = getCarouselRegion();
      expect(region).toHaveAttribute('aria-roledescription', 'carousel');
      expect(region).toHaveAttribute('aria-label', 'Projects carousel');

      const cards = screen.getAllByTestId('project-card');
      expect(cards).toHaveLength(data.length);

      const dotSpans = document.querySelectorAll('.flex.justify-center.gap-2.mt-4 > span');
      expect(dotSpans.length).toBe(3);
    });

    test('supports columnGap fallback when gap is empty', () => {
      getComputedStyleMock.mockImplementationOnce(
        () => ({ gap: '', columnGap: '10px' } as unknown as CSSStyleDeclaration)
      );
      render(<Carousel data={data} />);
      const wrapper = document.querySelector('.relative.mx-auto') as HTMLDivElement;
      const width = parseInt(wrapper.style.maxWidth || '0', 10);
      expect(width).toBeGreaterThanOrEqual(1180);
      expect(width).toBeLessThanOrEqual(1220);
    });
  });

  describe('Responsive behavior', () => {
    test('updates itemsPerView on window resize', () => {
      render(<Carousel data={data} />);
      const wrapper = document.querySelector('.relative.mx-auto') as HTMLDivElement;

      act(() => {
        window.innerWidth = 800;
        window.dispatchEvent(new Event('resize'));
      });
      let width = parseInt(wrapper.style.maxWidth || '0', 10);
      expect(width).toBeGreaterThanOrEqual(800);
      expect(width).toBeLessThanOrEqual(820);

      act(() => {
        window.innerWidth = 500;
        window.dispatchEvent(new Event('resize'));
      });
      width = parseInt(wrapper.style.maxWidth || '0', 10);
      expect(width).toBeGreaterThanOrEqual(420);
      expect(width).toBeLessThanOrEqual(440);

      act(() => {
        window.innerWidth = 1300;
        window.dispatchEvent(new Event('resize'));
      });
      width = parseInt(wrapper.style.maxWidth || '0', 10);
      expect(width).toBeGreaterThanOrEqual(1100);
      expect(width).toBeLessThanOrEqual(1220);
    });
  });

  describe('Navigation', () => {
    test('next/previous buttons scroll carousel and wrap around', async () => {
      render(<Carousel data={data} />);
      const region = getCarouselRegion();
      const nextBtn = screen.getByRole('button', { name: 'Next' });
      const prevBtn = screen.getByRole('button', { name: 'Previous' });

      const spyScroll = jest.spyOn(region, 'scrollTo');
      await user.click(nextBtn);
      await user.click(prevBtn);
      expect(spyScroll).toHaveBeenCalled();
    });

    test('keyboard arrow navigation scrolls and pauses autoplay', async () => {
      const user = userEvent.setup();
      render(<Carousel data={data} />);
      const region = getCarouselRegion();

      region.focus();
      expect(region).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(pauseMock).toHaveBeenCalledTimes(1);

      await user.keyboard('{ArrowLeft}');
      expect(pauseMock).toHaveBeenCalledTimes(2);
    });

    test('onScroll updates active dot based on nearest card', () => {
      render(<Carousel data={data} />);
      const region = getCarouselRegion();
      act(() => {
        region.scrollLeft = 7;
        region.dispatchEvent(new Event('scroll', { bubbles: true }));
      });
      const dots = document.querySelectorAll('.flex.justify-center.gap-2.mt-4 > span');
      const classes = [...dots].map((d) => d.className);
      expect(new Set(classes).size).toBeGreaterThan(1);
    });
  });

  describe('Autoplay and hover', () => {
    test('pauses on hover and resumes on mouse leave', async () => {
      render(<Carousel data={data} />);
      const wrapper = document.querySelector('.relative.mx-auto') as HTMLDivElement;
      await user.hover(wrapper);
      expect(pauseMock).toHaveBeenCalledTimes(1);
      await user.unhover(wrapper);
      expect(resumeMock).toHaveBeenCalledTimes(1);
    });

    test('autoplay tick scrolls carousel', () => {
      render(<Carousel data={data} />);
      const region = getCarouselRegion();
      expect(region.scrollLeft).toBe(0);
      autoplayTick?.();
      expect(region.scrollLeft).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Cleanup', () => {
    test('removes listeners and disconnects ResizeObserver on unmount', () => {
      const { unmount } = render(<Carousel data={data} />);
      const lastObserver = getLastResizeObserver();
      const removeSpyRegion = jest.spyOn(getCarouselRegion(), 'removeEventListener');
      const removeSpyWindow = jest.spyOn(window, 'removeEventListener');

      unmount();

      expect(lastObserver.disconnect).toHaveBeenCalled();
      expect(removeSpyWindow).toHaveBeenCalledWith('pointermove', expect.any(Function));
      expect(removeSpyWindow).toHaveBeenCalledWith('pointerup', expect.any(Function));
      expect(removeSpyRegion).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    test('clears mobile pause timeout on unmount after touch drag', () => {
      jest.useFakeTimers();
      const clearSpy = jest.spyOn(window, 'clearTimeout');

      const { unmount } = render(<Carousel data={data} />);
      const region = getCarouselRegion();

      const down = new window.PointerEvent('pointerdown', {
        bubbles: true,
        pointerId: 21,
        pointerType: 'touch',
      });
      region.dispatchEvent(down);
      const up = new window.PointerEvent('pointerup', { bubbles: true, pointerId: 21, pointerType: 'touch' });
      region.dispatchEvent(up);

      unmount();
      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
      jest.useRealTimers();
    });
  });

  describe('ResizeObserver', () => {
    test('recomputes layout and updates card width on container resize', () => {
      render(<Carousel data={data} />);
      const region = getCarouselRegion();
      Object.defineProperty(region, 'clientWidth', { configurable: true, value: 1440 });
      const lastObserver = getLastResizeObserver();
      act(() => lastObserver.trigger());

      const firstCardWrapper = region.querySelector('.snap-start') as HTMLDivElement;
      expect(firstCardWrapper).toBeTruthy();
      expect(firstCardWrapper.style.flex).toBe('0 0 380px');
    });
  });
});
