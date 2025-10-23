import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Arrow from './Arrow';

describe('Arrow Component', () => {
  test('renders arrow with default props', () => {
    render(<Arrow direction='up' />);

    const arrow = screen.getByRole('img', { name: 'Arrow pointing up' });
    expect(arrow).toBeVisible();
    expect(arrow).toHaveAttribute('aria-label', 'Arrow pointing up');
  });

  test('renders arrow with custom aria-label', () => {
    render(<Arrow direction='down' aria-label='Scroll down' />);

    const arrow = screen.getByRole('img', { name: 'Scroll down' });
    expect(arrow).toHaveAttribute('aria-label', 'Scroll down');
  });

  test('applies correct rotation for each direction', () => {
    const { rerender } = render(<Arrow direction='up' />);
    let arrow = screen.getByRole('img', { name: 'Arrow pointing up' });
    expect(arrow).toHaveStyle('transform: rotate(0deg)');

    rerender(<Arrow direction='right' />);
    arrow = screen.getByRole('img', { name: 'Arrow pointing right' });
    expect(arrow).toHaveStyle('transform: rotate(90deg)');

    rerender(<Arrow direction='down' />);
    arrow = screen.getByRole('img', { name: 'Arrow pointing down' });
    expect(arrow).toHaveStyle('transform: rotate(180deg)');

    rerender(<Arrow direction='left' />);
    arrow = screen.getByRole('img', { name: 'Arrow pointing left' });
    expect(arrow).toHaveStyle('transform: rotate(270deg)');
  });

  test('applies custom size', () => {
    render(<Arrow direction='up' size={32} />);

    const arrow = screen.getByRole('img', { name: 'Arrow pointing up' });
    expect(arrow).toHaveAttribute('width', '32');
    expect(arrow).toHaveAttribute('height', '32');
  });

  test('maintains base classes and applies custom className', () => {
    render(<Arrow direction='up' className='text-primary w-8 h-8' />);

    const arrow = screen.getByRole('img', { name: 'Arrow pointing up' });
    expect(arrow).toHaveClass('stroke-current', 'text-primary', 'w-8', 'h-8');
  });
});
