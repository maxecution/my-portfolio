import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RunicBackground } from './RunicBackground';
import { runes } from '@data/hero/Hero.data';
import useIsMobile from '@hooks/useIsMobile';

const RUNE_REGEX = new RegExp(runes.join('|'));

// Mock useIsMobile hook
jest.mock('@hooks/useIsMobile', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockUseIsMobile = useIsMobile as jest.MockedFunction<typeof useIsMobile>;

describe('RunicBackground', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the correct number of runes for small screens', () => {
    mockUseIsMobile.mockImplementation((breakpoint?: number) => breakpoint === 768);

    render(<RunicBackground />);
    const renderedRunes = screen.getAllByText(RUNE_REGEX);
    expect(renderedRunes.length).toBe(10); // small screen count
  });

  test('renders the correct number of runes for medium screens', () => {
    mockUseIsMobile.mockImplementation((breakpoint?: number) => breakpoint === 1024);

    render(<RunicBackground />);
    const renderedRunes = screen.getAllByText(RUNE_REGEX);
    expect(renderedRunes.length).toBe(15); // medium screen count
  });

  test('renders the correct number of runes for large screens', () => {
    mockUseIsMobile.mockImplementation((breakpoint?: number) => breakpoint === 1440);

    render(<RunicBackground />);
    const renderedRunes = screen.getAllByText(RUNE_REGEX);
    expect(renderedRunes.length).toBe(20); // large screen count
  });

  test('renders the default number of runes for extra large screens', () => {
    mockUseIsMobile.mockImplementation(() => false); // all breakpoints false → default to 30

    render(<RunicBackground />);
    const renderedRunes = screen.getAllByText(RUNE_REGEX);
    expect(renderedRunes.length).toBe(30); // default XL count
  });

  test('regenerates runes when count changes', () => {
    mockUseIsMobile.mockImplementation((bp?: number) => bp === 768);
    const { rerender } = render(<RunicBackground />);
    let renderedRunes = screen.getAllByText(RUNE_REGEX);
    expect(renderedRunes.length).toBe(10);

    mockUseIsMobile.mockImplementation((bp?: number) => bp === 1024);
    rerender(<RunicBackground />);

    renderedRunes = screen.getAllByText(RUNE_REGEX);
    expect(renderedRunes.length).toBe(15);
  });

  test('reuses existing runes when count does not change', () => {
    mockUseIsMobile.mockImplementation((bp?: number) => bp === 768);
    const { rerender } = render(<RunicBackground />);
    const firstRenderRunes = screen.getAllByText(RUNE_REGEX).map((el) => el.textContent);

    expect(firstRenderRunes.length).toBe(10);

    rerender(<RunicBackground />);
    const secondRenderRunes = screen.getAllByText(RUNE_REGEX).map((el) => el.textContent);

    expect(secondRenderRunes.length).toBe(10);

    expect(secondRenderRunes).toEqual(firstRenderRunes);
  });

  test('renders runes with correct styles applied', () => {
    // Simulate small screen
    mockUseIsMobile.mockImplementation((breakpoint?: number) => breakpoint === 768);

    render(<RunicBackground />);

    const rune = screen.getAllByText(RUNE_REGEX)[0];

    expect(rune).toHaveClass('float-rune');
    expect(rune).toHaveClass('text-primary/30');

    const style = rune.style;
    expect(style.top).toMatch(/\d+(\.\d+)?%/);
    expect(style.left).toMatch(/\d+(\.\d+)?%/);
    expect(style.fontSize).toMatch(/\d+(\.\d+)?rem/);
    expect(style.animationDuration).toMatch(/\d+(\.\d+)?s/);
    expect(style.animationDelay).toMatch(/-?\d+(\.\d+)?s/);
  });
});
