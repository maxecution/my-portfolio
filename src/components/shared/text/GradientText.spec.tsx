import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GradientText } from './GradientText';

describe('GradientText Component', () => {
  test('renders text with gradient styles and accessibility attributes', () => {
    render(<GradientText>Default Text</GradientText>);

    const textElement = screen.getByText('Default Text');
    expect(textElement).toBeVisible();

    // Check for gradient-related classes
    expect(textElement).toHaveClass('bg-gradient-to-r', 'bg-clip-text', 'text-transparent', 'animate-gradient');

    // Check for default primary gradient classes
    expect(textElement).toHaveClass('from-primary-200', 'via-primary-600', 'to-primary-200');

    // Check background size style
    expect(textElement).toHaveStyle('background-size: 200% auto');
  });

  test('renders with custom variant', () => {
    render(<GradientText variant='accent'>Accent Text</GradientText>);

    const textElement = screen.getByText('Accent Text');
    expect(textElement).toHaveClass('from-accent-200', 'via-accent-600', 'to-accent-200');
  });

  test('applies custom className', () => {
    render(<GradientText className='text-lg font-bold'>Custom Text</GradientText>);

    const textElement = screen.getByText('Custom Text');
    expect(textElement).toHaveClass('text-lg', 'font-bold');
  });
});
