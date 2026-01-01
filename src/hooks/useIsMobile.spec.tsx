import { render, screen, act, cleanup } from '@testing-library/react';
import useIsMobile from './useIsMobile';

const listeners: Record<string, ((e: MediaQueryListEvent) => void)[]> = {};

function dispatchChange(matches: boolean) {
  (listeners['change'] ?? []).forEach((cb) => cb({ matches } as MediaQueryListEvent));
}

beforeEach(() => {
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
      dispatchEvent: jest.fn(),
    })),
  });
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

function Probe({ breakpoint }: { breakpoint?: number }) {
  const isMobile = useIsMobile(breakpoint);
  return <div data-testid='mobile-flag'>{String(isMobile)}</div>;
}

describe('useIsMobile', () => {
  test('initial false', () => {
    render(<Probe />);
    expect(screen.getByTestId('mobile-flag').textContent).toBe('false');
  });

  test('updates on change events', () => {
    render(<Probe />);
    const flag = screen.getByTestId('mobile-flag');

    act(() => dispatchChange(true));
    expect(flag.textContent).toBe('true');

    act(() => dispatchChange(false));
    expect(flag.textContent).toBe('false');
  });

  test('re-runs when breakpoint changes', () => {
    const { rerender } = render(<Probe />);
    const flag = screen.getByTestId('mobile-flag');
    expect(flag.textContent).toBe('false');

    act(() => dispatchChange(true));
    expect(flag.textContent).toBe('true');

    rerender(<Probe breakpoint={1024} />);
    expect(flag.textContent).toBe('false');
  });
  test('uses custom breakpoint value', () => {
    const spy = jest.spyOn(window, 'matchMedia');
    render(<Probe breakpoint={500} />);
    expect(spy).toHaveBeenLastCalledWith('(max-width: 500px)');
    spy.mockRestore();
  });
  test('cleans up listener on unmount', () => {
    const { unmount } = render(<Probe />);
    const before = (listeners['change'] ?? []).length;

    unmount();

    const after = (listeners['change'] ?? []).length;
    expect(after).toBe(before - 1);
  });
});
