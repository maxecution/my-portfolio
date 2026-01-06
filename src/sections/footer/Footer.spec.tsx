import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

jest.mock('@data/page/Page.data', () => ({
  authorData: {
    firstName: 'Max',
  },
}));

describe('Footer component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('renders footer with all its content', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeVisible();
    expect(screen.getByText(/© 2026/i)).toBeVisible();
    expect(screen.getByText(/created by max/i)).toBeVisible();
    expect(screen.getByText(/every great app begins with a single line of code/i)).toBeVisible();

    const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ'];

    runes.forEach((rune) => {
      expect(screen.getByText(rune)).toBeVisible();
    });
  });
});
