// src/components/ContactForm.spec.tsx
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

describe('ContactForm (userEvent, no console checks)', () => {
  // Hooking user-event into fake timers so it plays nice with setTimeout in the component
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders fields and allows controlled input updates', async () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    const emailInput = screen.getByLabelText(/Your Email/i);
    const messageTextarea = screen.getByLabelText(/Your message/i);
    const button = screen.getByRole('button', { name: /cast sending/i });

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageTextarea).toHaveValue('');
    expect(button).toBeDisabled();

    await user.type(nameInput, 'Aragorn');
    expect(nameInput).toHaveValue('Aragorn');

    await user.type(emailInput, 'king@gondor.me');
    expect(emailInput).toHaveValue('king@gondor.me');

    await user.type(messageTextarea, 'For Frodo!');
    expect(messageTextarea).toHaveValue('For Frodo!');

    // Submit
    expect(button).toBeEnabled();
    await user.click(button);

    // Immediately: status = submitting
    expect(button).toBeDisabled();
    expect(screen.getByText('Sending...')).toBeInTheDocument();

    // Live region announces submitting
    const liveSubmitting = screen.getByText(/sending message/i, { selector: '.sr-only' });
    expect(liveSubmitting).toHaveTextContent('Sending message');

    const progress = screen.getByTestId('submit-progress-fill');
    expect(progress).toHaveClass('bg-primary-400 w-full');

    // Finish the async submit (2s)
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Now: status = success
    expect(screen.getByText('Sent!')).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button.className).toMatch(/bg-green-500/);

    // Live region announces success
    const liveSuccess = screen.getByText(/message sent/i, { selector: '.sr-only' });
    expect(liveSuccess).toHaveTextContent('Message sent');

    // Progress bar collapses after submitting
    expect(progress).not.toHaveClass('w-full');

    // Fields are cleared
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageTextarea).toHaveValue('');

    // Return to idle after 1.5s
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(button).toBeDisabled();
    expect(screen.getByText('Cast Sending')).toBeInTheDocument();
  });
});
