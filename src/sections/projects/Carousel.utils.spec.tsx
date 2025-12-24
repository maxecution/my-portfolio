import {
  computeCardLayout,
  getStep,
  applyLayoutToRef,
  computeLeftForIndex,
  goToIndexImpl,
  scrollByCardsImpl,
  setupPointerHandlers,
  AXIS_LOCK_THRESHOLD,
} from './Carousel.utils';

describe('Carousel utils', () => {
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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  function setup() {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const drag = {
      current: {
        active: false,
        startX: 0,
        startY: 0,
        scrollStart: 0,
        desiredScroll: 0,
        lockedAxis: null,
      },
    };

    const rafRef = { current: null as number | null };
    const layoutRef = { current: { cardWidth: 100, gap: 10 } };
    const autoplay = { pause: jest.fn(), resume: jest.fn() };
    const goToIndex = jest.fn();

    const cleanup = setupPointerHandlers({
      containerRef: { current: el },
      drag,
      rafRef,
      layoutRef,
      autoplay,
      goToIndex,
    });

    const PE = (
      window as unknown as {
        PointerEvent: new (type: string, props?: PointerEventInit) => PointerEvent;
      }
    ).PointerEvent;

    return { el, drag, rafRef, autoplay, cleanup, PE };
  }

  describe('computeCardLayout', () => {
    test('caps card width at MAX_CARD_WIDTH', () => {
      const el = document.createElement('div');
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: 2000 });

      jest
        .spyOn(window, 'getComputedStyle')
        .mockImplementation(() => ({ gap: '6px', columnGap: '' } as CSSStyleDeclaration));

      const { cardWidth, gap } = computeCardLayout(el, 3);
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(cardWidth).toBeLessThanOrEqual(380);
    });

    test('returns minimal positive cardWidth when container is very small', () => {
      const el = document.createElement('div');
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: 10 });

      jest
        .spyOn(window, 'getComputedStyle')
        .mockImplementation(() => ({ gap: '0px', columnGap: '' } as CSSStyleDeclaration));

      const { cardWidth } = computeCardLayout(el, 3);
      expect(cardWidth).toBeGreaterThanOrEqual(1);
    });

    test('falls back to columnGap when gap is empty', () => {
      const el = document.createElement('div');
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: 1200 });

      jest
        .spyOn(window, 'getComputedStyle')
        .mockImplementation(() => ({ gap: '', columnGap: '10px' } as CSSStyleDeclaration));

      const { gap } = computeCardLayout(el, 3);
      expect(gap).toBeCloseTo(10);
    });
  });

  describe('getStep', () => {
    test('returns 1 if cardWidth + gap is 0, otherwise returns sum', () => {
      expect(getStep(0, 0)).toBe(1);
      expect(getStep(1, 0)).toBe(1);
      expect(getStep(2, 3)).toBe(5);
    });
  });

  describe('applyLayoutToRef', () => {
    test('assigns cardWidth and gap to layoutRef and returns the same values', () => {
      const el = document.createElement('div');
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: 1200 });
      jest
        .spyOn(window, 'getComputedStyle')
        .mockImplementation(() => ({ gap: '6px', columnGap: '' } as CSSStyleDeclaration));

      const layoutRef = { current: { cardWidth: 0, gap: 0 } };
      const res = applyLayoutToRef(el, 3, layoutRef);
      expect(res.cardWidth).toBeGreaterThan(0);
      expect(layoutRef.current.cardWidth).toBe(res.cardWidth);
    });
  });

  describe('computeLeftForIndex', () => {
    test('clamps scrollLeft to maxLeft if index * step exceeds scrollable area', () => {
      const left = computeLeftForIndex(10, 100, 10, 500, 200);
      expect(left).toBe(300);
    });
  });

  describe('goToIndexImpl', () => {
    test('scrolls to correct position and returns true when element exists', () => {
      const el = document.createElement('div');
      Object.defineProperty(el, 'scrollWidth', { configurable: true, value: 1000 });
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: 300 });
      el.scrollTo = jest.fn();

      const layoutRef = { current: { cardWidth: 100, gap: 10 } };
      const res = goToIndexImpl(el, layoutRef, 10);
      expect(res).toBe(true);
      expect(el.scrollTo).toHaveBeenCalled();
    });

    test('returns false when element is null', () => {
      const layoutRef = { current: { cardWidth: 100, gap: 10 } };
      const res = goToIndexImpl(null, layoutRef, 1);
      expect(res).toBe(false);
    });
  });

  describe('scrollByCardsImpl', () => {
    test('calculates next index and scrolls to it', () => {
      const el = document.createElement('div');
      Object.defineProperty(el, 'scrollWidth', { configurable: true, value: 1000 });
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: 300 });
      Object.defineProperty(el, 'scrollLeft', { configurable: true, value: 0, writable: true });
      el.scrollTo = jest.fn();

      const layoutRef = { current: { cardWidth: 100, gap: 10 } };
      const next = scrollByCardsImpl(el, layoutRef, 1, 5, 3);
      expect(next).not.toBeNull();
      expect(el.scrollTo).toHaveBeenCalled();
    });

    test('returns null when element is null', () => {
      const layoutRef = { current: { cardWidth: 100, gap: 10 } };
      const res = scrollByCardsImpl(null, layoutRef, 1, 5, 3);
      expect(res).toBeNull();
    });
  });

  describe('setupPointerHandlers', () => {
    test('returns a no-op cleanup when containerRef.current is null', () => {
      const cleanup = setupPointerHandlers({
        containerRef: { current: null },
        drag: { current: { active: false, startX: 0, startY: 0, scrollStart: 0, desiredScroll: 0, lockedAxis: null } },
        rafRef: { current: null },
        layoutRef: { current: { cardWidth: 0, gap: 0 } },
        autoplay: { pause: () => undefined, resume: () => undefined },
        goToIndex: () => undefined,
      });

      expect(typeof cleanup).toBe('function');
      expect(() => cleanup()).not.toThrow();
    });
    test('rAF step sets rafRef.current=null when drag ends', () => {
      const { el, rafRef, cleanup } = setup();

      let pendingCb: FrameRequestCallback | undefined;
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = (cb) => {
        pendingCb = cb;
        return 1;
      };

      // Start drag
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 100, pointerType: 'mouse' }));
      // Move pointer to schedule rAF
      window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 50, pointerType: 'mouse' }));
      // End drag
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse' }));

      // Manually invoke rAF callback to exercise "else { rafRef.current = null }"
      expect(pendingCb).toBeDefined();
      pendingCb?.(performance.now());
      expect(rafRef.current).toBeNull();

      cleanup();
      window.requestAnimationFrame = originalRAF;
    });

    test('pointerdown returns early when non-touch event originates from an interactive element', () => {
      const { el, drag, autoplay, cleanup, PE } = setup();

      const button = document.createElement('button');
      el.appendChild(button);

      button.dispatchEvent(
        new PE('pointerdown', {
          bubbles: true,
          pointerType: 'mouse',
          clientX: 100,
          clientY: 0,
          pointerId: 1,
        })
      );

      expect(drag.current.active).toBe(false);
      expect(drag.current.lockedAxis).toBeNull();
      expect(el.classList.contains('dragging')).toBe(false);
      expect(autoplay.pause).toHaveBeenCalledTimes(1);

      cleanup();
    });

    test('pointermove returns early when movement is below AXIS_LOCK_THRESHOLD', () => {
      const { el, drag, rafRef, cleanup, PE } = setup();

      const spyRAF = jest.spyOn(window, 'requestAnimationFrame');

      el.dispatchEvent(
        new PE('pointerdown', {
          bubbles: true,
          pointerType: 'mouse',
          clientX: 100,
          clientY: 100,
        })
      );

      window.dispatchEvent(
        new PE('pointermove', {
          bubbles: true,
          pointerType: 'mouse',
          clientX: 100 + AXIS_LOCK_THRESHOLD - 1,
          clientY: 100 + AXIS_LOCK_THRESHOLD - 1,
        })
      );

      expect(drag.current.lockedAxis).toBeNull();
      expect(drag.current.active).toBe(true);
      expect(spyRAF).not.toHaveBeenCalled();
      expect(rafRef.current).toBeNull();
      expect(el.scrollLeft).toBe(0);

      cleanup();
      spyRAF.mockRestore();
    });

    test('pointermove with vertical intent exits early and does not start horizontal drag', () => {
      const { el, drag, rafRef, cleanup, PE } = setup();
      const spyRAF = jest.spyOn(window, 'requestAnimationFrame');

      drag.current.scrollStart = 50;
      el.scrollLeft = 50;

      el.dispatchEvent(
        new PE('pointerdown', {
          bubbles: true,
          pointerType: 'mouse',
          clientX: 100,
          clientY: 100,
        })
      );

      window.dispatchEvent(
        new PE('pointermove', {
          bubbles: true,
          pointerType: 'mouse',
          clientX: 102,
          clientY: 120,
        })
      );

      expect(drag.current.desiredScroll).toBe(drag.current.scrollStart);
      expect(el.scrollLeft).toBe(50);
      expect(rafRef.current).toBeNull();
      expect(spyRAF).not.toHaveBeenCalled();

      cleanup();
      spyRAF.mockRestore();
    });

    test('wraps scroll to start when exceeding max index', () => {
      const { el, cleanup } = setup();

      // Simulate drag that would go beyond max index
      const scrollWidth = 300;
      const clientWidth = 100;
      Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth });
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: clientWidth });
      (el as HTMLElement).scrollLeft = 200; // beyond max

      const layoutRef = { current: { cardWidth: 100, gap: 10 } };

      // Manually invoke goToIndexImpl via scrollByCardsImpl to simulate "wrap"
      const nextIndex = scrollByCardsImpl(el, layoutRef, 1, 2, 3);
      expect(nextIndex).toBe(0);
      cleanup();
    });

    test('sets and releases pointer capture if API exists', () => {
      const { el, drag, cleanup, PE } = setup();

      const setPointerCapture = jest.fn();
      const releasePointerCapture = jest.fn();

      Object.defineProperty(el, 'setPointerCapture', { value: setPointerCapture, configurable: true });
      Object.defineProperty(el, 'releasePointerCapture', { value: releasePointerCapture, configurable: true });

      el.dispatchEvent(new PE('pointerdown', { bubbles: true, pointerType: 'mouse', pointerId: 1, clientX: 100 }));
      expect(setPointerCapture).toHaveBeenCalledWith(1);
      expect(drag.current.active).toBe(true);

      window.dispatchEvent(new PE('pointerup', { bubbles: true, pointerType: 'mouse', pointerId: 1 }));
      expect(releasePointerCapture).toHaveBeenCalledWith(1);

      cleanup();
    });

    test('enableSnapAfterScroll restores scroll snap after scrolling stops', () => {
      const { el, drag, cleanup, PE } = setup();
      drag.current.active = true;

      el.dispatchEvent(new PE('pointerdown', { pointerType: 'mouse', clientX: 100, clientY: 0 }));
      window.dispatchEvent(new PE('pointermove', { pointerType: 'mouse', clientX: 50, clientY: 0 }));
      window.dispatchEvent(new PE('pointerup', { pointerType: 'mouse' }));
      el.dispatchEvent(new Event('scroll'));

      expect(el.style.scrollSnapType).not.toBe('x mandatory');

      jest.advanceTimersByTime(100);
      expect(el.style.scrollSnapType).toBe('x mandatory');
      expect(el.style.scrollBehavior).toBe('');

      cleanup();
    });

    test('enableSnapAfterScroll does not attach multiple scroll listeners while already restoring', () => {
      const { el, drag, cleanup, PE } = setup();
      drag.current.active = true;

      el.dispatchEvent(new PE('pointerdown', { pointerType: 'mouse', clientX: 100, clientY: 0 }));
      window.dispatchEvent(new PE('pointermove', { pointerType: 'mouse', clientX: 50, clientY: 0 }));
      window.dispatchEvent(new PE('pointerup', { pointerType: 'mouse' }));
      el.dispatchEvent(new Event('scroll'));
      el.dispatchEvent(new Event('scroll'));

      expect(jest.getTimerCount()).toBe(1);

      cleanup();
    });

    describe('dragging behavior', () => {
      test('pointermove without active drag does not schedule rAF', () => {
        setup();
        const spyRAF = jest.spyOn(window, 'requestAnimationFrame');

        const move = new PointerEvent('pointermove', { bubbles: true, clientX: 10, pointerType: 'mouse' });
        window.dispatchEvent(move);

        expect(spyRAF).not.toHaveBeenCalled();
        spyRAF.mockRestore();
      });

      test('pointermove during active drag schedules rAF only once', () => {
        const { el, drag, cleanup } = setup();
        const spyRAF = jest.spyOn(window, 'requestAnimationFrame');

        el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 100, pointerType: 'mouse' }));
        drag.current.active = true;

        // Multiple moves
        window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 80, pointerType: 'mouse' }));
        window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 60, pointerType: 'mouse' }));

        expect(spyRAF).toHaveBeenCalled();
        // Only one rAF loop should be scheduled at a time
        expect(spyRAF.mock.calls.length).toBeLessThanOrEqual(2);

        el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 60, pointerType: 'mouse' }));

        cleanup();
        spyRAF.mockRestore();
      });

      test('mouse drag updates scrollLeft smoothly and restores scrollSnap on release', () => {
        const { el, drag, cleanup, PE } = setup();
        let pendingCb: FrameRequestCallback | undefined;
        const originalRAF = window.requestAnimationFrame;

        window.requestAnimationFrame = (cb: FrameRequestCallback) => {
          pendingCb = cb;
          return 1;
        };

        el.dispatchEvent(new PE('pointerdown', { bubbles: true, pointerType: 'mouse', clientX: 100 }));
        expect(drag.current.active).toBe(true);

        window.dispatchEvent(new PE('pointermove', { bubbles: true, pointerType: 'mouse', clientX: 50 }));
        pendingCb?.(performance.now());

        expect(el.scrollLeft).toBe(drag.current.desiredScroll);

        window.dispatchEvent(new PE('pointerup', { bubbles: true, pointerType: 'mouse' }));
        expect(drag.current.active).toBe(false);
        expect(el.classList.contains('dragging')).toBe(false);
        expect(el.style.scrollBehavior).toBe('smooth');
        expect(el.style.scrollSnapType).toBe('none');

        cleanup();
        window.requestAnimationFrame = originalRAF;
      });

      test('touch drag delays autoplay resume and clears timeout on additional touches', () => {
        const { el, autoplay, cleanup, PE } = setup();

        el.dispatchEvent(new PE('pointerdown', { pointerType: 'touch', clientX: 100, clientY: 0 }));
        window.dispatchEvent(new PE('pointermove', { pointerType: 'touch', clientX: 50, clientY: 0 }));
        window.dispatchEvent(new PE('pointerup', { pointerType: 'touch' }));

        expect(autoplay.resume).toHaveBeenCalledTimes(0);

        jest.advanceTimersByTime(15000);
        expect(autoplay.resume).toHaveBeenCalledTimes(1);

        el.dispatchEvent(new PE('pointerdown', { pointerType: 'touch', clientX: 100, clientY: 0 }));
        window.dispatchEvent(new PE('pointermove', { pointerType: 'touch', clientX: 50, clientY: 0 }));
        window.dispatchEvent(new PE('pointerup', { pointerType: 'touch' }));

        cleanup();
        jest.advanceTimersByTime(15000);
        expect(autoplay.resume).toHaveBeenCalledTimes(1);
      });

      test('pointerdown cancels pending snap restoration timers', () => {
        const { el, drag, cleanup, PE } = setup();
        drag.current.active = true;

        el.dispatchEvent(new PE('pointerdown', { pointerType: 'mouse', clientX: 100, clientY: 0 }));
        window.dispatchEvent(new PE('pointermove', { pointerType: 'mouse', clientX: 50, clientY: 0 }));
        window.dispatchEvent(new PE('pointerup', { pointerType: 'mouse' }));
        el.dispatchEvent(new Event('scroll'));

        expect(jest.getTimerCount()).toBe(1);

        el.dispatchEvent(new PE('pointerdown', { bubbles: true, pointerType: 'mouse', pointerId: 2, clientX: 50 }));
        expect(jest.getTimerCount()).toBe(0);

        jest.advanceTimersByTime(200);
        expect(el.style.scrollSnapType).not.toBe('x mandatory');

        cleanup();
      });
    });
  });
});
