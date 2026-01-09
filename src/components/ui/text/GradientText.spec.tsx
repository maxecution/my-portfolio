import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GradientText } from './GradientText';

describe('GradientText Component', () => {
  test('renders text with gradient styles and accessibility attributes', () => {
    render(<GradientText>Default Text</GradientText>);

    const textElement = screen.getByText('Default Text');
    expect(textElement).toBeVisible();

    // Check for gradient-related classes
    expect(textElement).toHaveClass('bg-linear-to-r', 'bg-clip-text', 'text-transparent', 'animate-gradient');

    // Check for default primary gradient classes
    expect(textElement).toHaveClass('from-primary-600', 'via-primary-200', 'to-primary-600');

    // Check background size style
    expect(textElement).toHaveStyle('background-size: 400% auto');
  });

  test('renders with custom variant', () => {
    render(<GradientText variant='accent'>Accent Text</GradientText>);

    const textElement = screen.getByText('Accent Text');
    expect(textElement).toHaveClass('from-accent-600', 'via-accent-200', 'to-accent-600');
  });

  test('applies custom className', () => {
    render(<GradientText className='text-lg font-bold'>Custom Text</GradientText>);

    const textElement = screen.getByText('Custom Text');
    expect(textElement).toHaveClass('text-lg', 'font-bold');
  });
});
