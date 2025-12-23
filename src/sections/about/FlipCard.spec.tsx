import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlipCard from './FlipCard';
describe('FlipCard Component', () => {
  const mockFront = (
    <div>
      <h3>Front Title</h3>
      <p>Front description</p>
    </div>
  );

  const mockBack = (
    <div>
      <h3>Back Title</h3>
      <p>Back description</p>
    </div>
  );

  const mockOnClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render front content with entrance animation when not flipped', () => {
    const { container } = render(
      <FlipCard front={mockFront} back={mockBack} flipped={false} onClick={mockOnClick} sectionVisible />
    );
    const wrapper = container.firstChild as HTMLElement;
    const button = container.querySelector('button');

    expect(screen.getByText('Front Title')).toBeVisible();
    expect(screen.getByText('Front description')).toBeVisible();
    expect(wrapper).toHaveClass('opacity-100', 'translate-y-0');
    expect(wrapper).toHaveAttribute('aria-hidden', 'false');
    expect(button).toHaveAttribute('tabindex', '0');
    expect(button).not.toHaveClass('[transform:rotateY(180deg)]');
  });

  test('should hide when sectionVisible is false and button to not be selectable', () => {
    const { container } = render(
      <FlipCard front={mockFront} back={mockBack} flipped={false} onClick={mockOnClick} sectionVisible={false} />
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass('opacity-0', 'translate-y-5');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');

    const button = container.querySelector('button');
    expect(button).toHaveAttribute('tabindex', '-1');
  });

  test('should apply flip transform and show back content when flipped', () => {
    const { container } = render(
      <FlipCard front={mockFront} back={mockBack} flipped onClick={mockOnClick} sectionVisible />
    );
    const button = container.querySelector('button');

    expect(button).toHaveClass('[transform:rotateY(180deg)]');
    expect(screen.getByText('Back Title')).toBeVisible();
    expect(screen.getByText('Back description')).toBeVisible();
  });

  test('should call onClick when card is clicked', () => {
    render(<FlipCard front={mockFront} back={mockBack} flipped={false} onClick={mockOnClick} sectionVisible />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('should apply transition delay when sectionVisible is true and delay is provided', () => {
    const { container } = render(
      <FlipCard front={mockFront} back={mockBack} flipped={false} onClick={mockOnClick} sectionVisible delay={0.5} />
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveStyle({ transitionDelay: '0.5s' });
  });

  test('should default to 0s delay when no delay prop is provided', () => {
    const { container } = render(
      <FlipCard front={mockFront} back={mockBack} flipped={false} onClick={mockOnClick} sectionVisible />
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveStyle({ transitionDelay: '0s' });
  });

  test('should ignore delay when sectionVisible is false', () => {
    const { container } = render(
      <FlipCard
        front={mockFront}
        back={mockBack}
        flipped={false}
        onClick={mockOnClick}
        sectionVisible={false}
        delay={0.5}
      />
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveStyle({ transitionDelay: '0s' });
  });

  test('should merge custom className', () => {
    const { container } = render(
      <FlipCard
        front={mockFront}
        back={mockBack}
        flipped={false}
        onClick={mockOnClick}
        sectionVisible
        className='custom-class'
      />
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass('transition-opacity', 'custom-class');
  });

  test('should apply correct structural classes for 3D flip effect', () => {
    const { container } = render(
      <FlipCard front={mockFront} back={mockBack} flipped={false} onClick={mockOnClick} sectionVisible />
    );

    const innerDiv = container.querySelector('.\\[perspective\\:1000px\\]');
    const frontDiv = container.querySelector('.\\[backface-visibility\\:hidden\\]');
    const backDiv = container.querySelector('.\\[transform\\:rotateY\\(180deg\\)\\]');

    expect(innerDiv).toHaveClass('h-64', 'relative', 'w-full', 'hover:scale-105', 'transition-transform');
    expect(frontDiv).toHaveClass('[backface-visibility:hidden]');
    expect(backDiv).toHaveClass('[backface-visibility:hidden]', '[transform:rotateY(180deg)]');
  });
});
