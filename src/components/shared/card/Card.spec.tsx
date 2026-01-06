import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card Component', () => {
  test('should render children correctly', () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    );

    expect(screen.getByText('Test Content')).toBeVisible();
  });

  test('should apply default classes', () => {
    const { container } = render(<Card>Content</Card>);
    const cardElement = container.firstChild as HTMLElement;

    expect(cardElement).toHaveClass('bg-card', 'border-2', 'border-primary/30', 'rounded-lg', 'p-8', 'relative');
  });

  test('should merge custom className with default classes', () => {
    const { container } = render(<Card className='custom-class mb-4'>Content</Card>);
    const cardElement = container.firstChild as HTMLElement;

    expect(cardElement).toHaveClass('bg-card', 'custom-class', 'mb-4');
  });

  test('should render all four decorative corner elements', () => {
    const { container } = render(<Card>Content</Card>);
    const corners = container.querySelectorAll('.absolute.border-primary');

    expect(corners).toHaveLength(4);
  });

  test('should render top-left corner with correct classes', () => {
    const { container } = render(<Card>Content</Card>);
    const topLeft = container.querySelector('.\\-top-0\\.5.\\-left-0\\.5');

    expect(topLeft).toBeVisible();
    expect(topLeft).toHaveClass('border-t-2', 'border-l-2', 'rounded-tl-sm');
  });

  test('should render top-right corner with correct classes', () => {
    const { container } = render(<Card>Content</Card>);
    const topRight = container.querySelector('.\\-top-0\\.5.\\-right-0\\.5');

    expect(topRight).toBeVisible();
    expect(topRight).toHaveClass('border-t-2', 'border-r-2', 'rounded-tr-sm');
  });

  test('should render bottom-left corner with correct classes', () => {
    const { container } = render(<Card>Content</Card>);
    const bottomLeft = container.querySelector('.\\-bottom-0\\.5.\\-left-0\\.5');

    expect(bottomLeft).toBeVisible();
    expect(bottomLeft).toHaveClass('border-b-2', 'border-l-2', 'rounded-bl-sm');
  });

  test('should render bottom-right corner with correct classes', () => {
    const { container } = render(<Card>Content</Card>);
    const bottomRight = container.querySelector('.\\-bottom-0\\.5.\\-right-0\\.5');

    expect(bottomRight).toBeVisible();
    expect(bottomRight).toHaveClass('border-b-2', 'border-r-2', 'rounded-br-sm');
  });

  test('should wrap children in a relative z-0 div', () => {
    const { container } = render(<Card>Test Content</Card>);
    const contentWrapper = container.querySelector('.relative.z-0');

    expect(contentWrapper).toBeVisible();
    expect(contentWrapper).toHaveTextContent('Test Content');
  });

  test('should pass through additional HTML attributes', () => {
    render(
      <Card data-testid='custom-card' aria-label='Test Card'>
        Content
      </Card>
    );
    const cardElement = screen.getByTestId('custom-card');

    expect(cardElement).toHaveAttribute('data-testid', 'custom-card');
    expect(cardElement).toHaveAttribute('aria-label', 'Test Card');
  });

  test('should handle complex children structure', () => {
    render(
      <Card>
        <div>
          <h3>Title</h3>
          <p>Description</p>
          <button>Action</button>
        </div>
      </Card>
    );

    expect(screen.getByText('Title')).toBeVisible();
    expect(screen.getByText('Description')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Action' })).toBeVisible();
  });

  test('should handle empty className prop', () => {
    const { container } = render(<Card className=''>Content</Card>);
    const cardElement = container.firstChild as HTMLElement;

    expect(cardElement).toHaveClass('bg-card', 'border-2');
  });

  test('should override conflicting Tailwind classes when className is provided', () => {
    const { container } = render(<Card className='p-4 bg-red-500'>Content</Card>);
    const cardElement = container.firstChild as HTMLElement;

    expect(cardElement.className).toContain('p-4');
    expect(cardElement.className).toContain('bg-red-500');
  });

  test('should render with multiple children', () => {
    render(
      <Card>
        <span>First</span>
        <span>Second</span>
        <span>Third</span>
      </Card>
    );

    expect(screen.getByText('First')).toBeVisible();
    expect(screen.getByText('Second')).toBeVisible();
    expect(screen.getByText('Third')).toBeVisible();
  });
});
