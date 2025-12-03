import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pill from './Pill';

describe('Pill Component', () => {
  test('should render children correctly', () => {
    render(<Pill>Test Label</Pill>);

    expect(screen.getByText('Test Label')).toBeVisible();
  });

  test('should apply default classes', () => {
    const { container } = render(<Pill>Content</Pill>);
    const pillElement = container.firstChild as HTMLElement;

    expect(pillElement).toHaveClass('inline-flex', 'items-center', 'px-3', 'py-1', 'rounded-full', 'border');
  });

  test('should apply all Tailwind colour classes together', () => {
    const { container } = render(
      <Pill bg='bg-secondary/20' text='text-foreground' border='border-secondary/30'>
        Content
      </Pill>
    );
    const pillElement = container.firstChild as HTMLElement;

    expect(pillElement).toHaveClass('bg-secondary/20', 'text-foreground', 'border-secondary/30');
  });

  test('should apply all hex colors as inline styles', () => {
    const { container } = render(
      <Pill bg='#ff0000' text='#00ff00' border='#0000ff'>
        Content
      </Pill>
    );
    const pillElement = container.firstChild as HTMLElement;

    expect(pillElement).toHaveStyle({
      backgroundColor: '#ff0000',
      color: '#00ff00',
      borderColor: '#0000ff',
    });
  });

  test('should merge custom className with default classes', () => {
    const { container } = render(<Pill className='ml-2 font-bold'>Content</Pill>);
    const pillElement = container.firstChild as HTMLElement;

    expect(pillElement).toHaveClass('inline-flex', 'ml-2', 'font-bold');
  });

  test('should handle mix of Tailwind and hex colors', () => {
    const { container } = render(
      <Pill bg='bg-primary/20' text='#ffffff' border='border-primary/30'>
        Content
      </Pill>
    );
    const pillElement = container.firstChild as HTMLElement;

    expect(pillElement).toHaveClass('bg-primary/20', 'border-primary/30');
    expect(pillElement).toHaveStyle({ color: '#ffffff' });
  });

  test('should not add colour classes when hex colors are provided', () => {
    const { container } = render(
      <Pill bg='#ff0000' text='#00ff00' border='#0000ff'>
        Content
      </Pill>
    );
    const pillElement = container.firstChild as HTMLElement;

    expect(pillElement).not.toHaveClass('bg-#ff0000');
    expect(pillElement).not.toHaveClass('text-#00ff00');
    expect(pillElement).not.toHaveClass('border-#0000ff');
  });

  test('should render with complex children structure', () => {
    render(
      <Pill>
        <span>Content</span> <strong>More Content</strong>
      </Pill>
    );

    expect(screen.getByText('Content')).toBeVisible();
    expect(screen.getByText('More Content')).toBeVisible();
  });

  test('should handle rgb colour format', () => {
    const { container } = render(<Pill bg='rgb(255, 0, 0)'>Content</Pill>);
    const pillElement = container.firstChild as HTMLElement;

    expect(pillElement).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
  });

  test('should handle rgba colour format', () => {
    const { container } = render(<Pill bg='rgba(255, 0, 0, 0.5)'>Content</Pill>);
    const pillElement = container.firstChild as HTMLElement;

    expect(pillElement).toHaveStyle({ backgroundColor: 'rgba(255, 0, 0, 0.5)' });
  });

  test('should render without colour inline styles when no colour props provided', () => {
    const { container } = render(<Pill>Content</Pill>);
    const pillElement = container.firstChild as HTMLElement;

    expect(screen.getByText('Content')).toBeVisible();
    expect(pillElement).toHaveClass('inline-flex');
  });

  test('should work with only custom className and no colour props', () => {
    const { container } = render(<Pill className='bg-red-500 text-white'>Content</Pill>);
    const pillElement = container.firstChild as HTMLElement;

    expect(pillElement).toHaveClass('bg-red-500', 'text-white', 'inline-flex');
  });
});
