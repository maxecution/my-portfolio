import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import ToastItem from './ToastItem';
import type { Toast } from './ToastContext';

describe('ToastItem', () => {
  let user: UserEvent;
  const onClose = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  test('renders message and applies correct style', () => {
    render(
      <ToastItem toast={{ id: '1', level: 'warning', message: 'Careful now', duration: 5000 }} onClose={jest.fn()} />
    );

    const toast = screen.getByText('Careful now').parentElement!;
    expect(toast.className).toContain('bg-amber-50');
  });

  test('calls onClose with id when dismissed', async () => {
    const onClose = jest.fn();

    render(<ToastItem toast={{ id: 'abc', level: 'error', message: 'Boom', duration: 5000 }} onClose={onClose} />);

    await user.click(screen.getByLabelText('Dismiss notification'));

    expect(onClose).toHaveBeenCalledWith('abc');
  });

  test('progress reaches 0 and interval is cleared', () => {
    const toast: Toast = {
      id: '1',
      level: 'success',
      message: 'Hi',
      duration: 10,
    };

    render(<ToastItem toast={toast} onClose={onClose} />);

    const progressBar = screen.getByTestId('toast-progress-bar');

    expect(progressBar).toHaveStyle({ width: '100%' });

    act(() => {
      jest.advanceTimersByTime(20);
    });

    expect(progressBar).toHaveStyle({ width: '0%' });
  });
});
