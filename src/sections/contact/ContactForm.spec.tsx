import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import ContactForm from './ContactForm';

describe('ContactForm (userEvent, no console checks)', () => {
  // Hooking user-event into fake timers so it plays nice with setTimeout in the component
  let user: UserEvent;

  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  });

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  test('early return when form is invalid', async () => {
    // bypassing the button disabled state by submitting the <form> directly
    const { container } = render(<ContactForm />);
    const form = container.querySelector('form')!;
    const nameInput = screen.getByLabelText(/Your Name/i);
    const emailInput = screen.getByLabelText(/Your Email/i);
    const subjectInput = screen.getByLabelText(/Subject/i);

    // Fill some fields but keep the form invalid (leave message empty)
    await user.type(nameInput, 'Samwise');
    await user.type(emailInput, 'sam@shire.me');
    await user.type(subjectInput, 'Second breakfast?');

    // Button is disabled; we submit the <form> directly to invoke the handler.
    fireEvent.submit(form);

    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByText('Cast Sending')).toBeVisible();
  });

  test('does not submit when not idle (already submitting)', async () => {
    // Mock a fetch that never resolves to keep status='submitting'
    (fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    const { container } = render(<ContactForm />);
    const form = container.querySelector('form')!;

    const nameInput = screen.getByLabelText(/Your Name/i);
    const emailInput = screen.getByLabelText(/Your Email/i);
    const subjectInput = screen.getByLabelText(/Subject/i);
    const messageTextarea = screen.getByLabelText(/Your message/i);
    const button = screen.getByRole('button', { name: /Cast Sending/i });

    await user.type(nameInput, 'Gimli');
    await user.type(emailInput, 'axe@erebor.me');
    await user.type(subjectInput, 'And my axe!');
    await user.type(messageTextarea, 'Never toss a dwarf.');

    expect(button).toBeEnabled();

    // First click -> status becomes 'submitting'
    await user.click(button);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Sending...')).toBeVisible();

    // Second click while submitting should early-return (no extra fetch)
    fireEvent.submit(form);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('uses default throw message when error is missing in response JSON', async () => {
    // Force a failure with empty JSON -> triggers `throw new Error('Failed to send')`
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    // Silence the console noise from the catch block
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Your Name/i), 'Legolas');
    await user.type(screen.getByLabelText(/Your Email/i), 'elf@mirkwood.me');
    await user.type(screen.getByLabelText(/Subject/i), 'A red sun rises');
    await user.type(screen.getByLabelText(/Your message/i), 'Blood has been spilled this night.');

    const button = screen.getByRole('button', { name: /Cast Sending/i });
    await user.click(button);

    expect(screen.getByText('Sending...')).toBeVisible();

    // Error UI appears after the failed response
    await waitFor(() => {
      expect(screen.getByText('Failed - try again!')).toBeVisible();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error submitting contact form:', new Error('Failed to send'));

    // stays disabled during error
    expect(button).toBeDisabled();

    // Return to idle after 2.5s
    await act(async () => {
      jest.advanceTimersByTime(2500);
    });

    expect(screen.getByText('Cast Sending')).toBeVisible();

    consoleSpy.mockRestore();
  });

  test('successful submission flow', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    const emailInput = screen.getByLabelText(/Your Email/i);
    const subjectInput = screen.getByLabelText(/Subject/i);
    const messageTextarea = screen.getByLabelText(/Your message/i);
    const button = screen.getByRole('button', { name: /Cast Sending/i });

    // Initially disabled
    expect(button).toBeDisabled();

    await user.type(nameInput, 'Aragorn');
    await user.type(emailInput, 'king@gondor.me');
    await user.type(subjectInput, 'For Frodo!');
    await user.type(messageTextarea, 'The beacons are lit!');

    expect(button).toBeEnabled();

    await user.click(button);

    // Submitting state
    expect(button).toBeDisabled();
    expect(screen.getByText('Sending...')).toBeVisible();

    const liveSubmitting = screen.getByText(/sending message/i, { selector: '.sr-only' });
    expect(liveSubmitting).toHaveTextContent('Sending message');

    // Wait for fetch to resolve
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', expect.any(Object));
    });

    // Success state
    const successUi = await screen.findByText('Sent!');
    expect(successUi).toBeVisible();

    expect(button).toHaveClass('bg-green-500');

    const liveSuccess = screen.getByText(/Message sent/i, { selector: '.sr-only' });
    expect(liveSuccess).toHaveTextContent('Message sent');

    // Fields cleared
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageTextarea).toHaveValue('');

    // Return to idle after 1.5s
    await act(async () => jest.advanceTimersByTime(1500));

    expect(screen.getByText('Cast Sending')).toBeVisible();
    expect(button).toBeDisabled();
  });

  test('error submission flow', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Resend failure' }),
    });

    // Silence the console noise from the catch block
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Your Name/i), 'Boromir');
    await user.type(screen.getByLabelText(/Your Email/i), 'boromir@gondor.me');
    await user.type(screen.getByLabelText(/Subject/i), 'Council of Elrond');
    await user.type(screen.getByLabelText(/Your message/i), 'One does not simply test forms');

    const button = screen.getByRole('button', { name: /Cast Sending/i });
    await user.click(button);

    expect(screen.getByText('Sending...')).toBeVisible();

    const errorUi = await screen.findByText('Failed - try again!');
    expect(errorUi).toBeVisible();

    const liveError = screen.getByText(/Failed to send message/i, { selector: '.sr-only' });
    expect(liveError).toHaveTextContent('Failed to send message');

    // Button remains disabled during error display
    expect(button).toBeDisabled();

    // Return to idle after 2.5s
    await act(async () => jest.advanceTimersByTime(2500));

    expect(screen.getByText('Cast Sending')).toBeVisible();

    consoleSpy.mockRestore();
  });

  test('fallback to "Unknown error" when response.json() fails', async () => {
    // Simulate a response that is not ok, and json() throws
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(new Error('Cannot parse')),
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Your Name/i), 'Frodo');
    await user.type(screen.getByLabelText(/Your Email/i), 'frodo@shire.me');
    await user.type(screen.getByLabelText(/Your message/i), 'Ring stuff');

    const button = screen.getByRole('button', { name: /Cast Sending/i });
    await user.click(button);

    const errorUi = await screen.findByText('Failed - try again!');
    expect(errorUi).toBeVisible();

    expect(consoleSpy).toHaveBeenCalledWith('Error submitting contact form:', new Error('Unknown error'));

    consoleSpy.mockRestore();
  });
});
