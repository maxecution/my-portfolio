import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toaster from './Toaster';
import type { Toast } from './ToastContext';

const toasts: Toast[] = [
  { id: '1', level: 'success', message: 'Success toast', duration: 5000 },
  { id: '2', level: 'error', message: 'Error toast', duration: 5000 },
];

describe('Toaster', () => {
  test('renders a list of ToastItems', () => {
    render(<Toaster toasts={toasts} onClose={jest.fn()} />);

    expect(screen.getByText('Success toast')).toBeVisible();
    expect(screen.getByText('Error toast')).toBeVisible();
  });

  test('has correct ARIA attributes', () => {
    render(<Toaster toasts={toasts} onClose={jest.fn()} />);

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-live', 'polite');
  });
});
