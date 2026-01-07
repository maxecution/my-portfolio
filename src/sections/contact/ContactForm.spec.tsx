import { screen, act, waitFor, fireEvent } from '@testing-library/react';
import { renderWithToasterProvider, mockToast } from '@contexts/toasterProvider/renderWithToasterProvider';
import '@testing-library/jest-dom';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import ContactForm from './ContactForm';

describe('ContactForm (userEvent)', () => {
  // Hooking user-event into fake timers so it plays nice with setTimeout in the component
  let user: UserEvent;

  beforeEach(() => {
    jest.useFakeTimers();
    mockToast.mockClear();
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

  async function fillValidForm() {
    await user.type(screen.getByLabelText(/Your Name/i), 'Tester');
    await user.type(screen.getByLabelText(/Your Email/i), 'tester@example.com');
    await user.type(screen.getByLabelText(/Your message/i), 'Testing toaster paths');
  }

  test('early return when form is invalid', async () => {
    // bypassing the button disabled state by submitting the <form> directly
    const { container } = renderWithToasterProvider(<ContactForm />);
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
    expect(screen.getByText('Prepare Sending')).toBeVisible();
  });

  test('does not submit when not idle (already submitting)', async () => {
    // Mock a fetch that never resolves to keep status='submitting'
    (fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    const { container } = renderWithToasterProvider(<ContactForm />);
    const form = container.querySelector('form')!;

    const nameInput = screen.getByLabelText(/Your Name/i);
    const emailInput = screen.getByLabelText(/Your Email/i);
    const subjectInput = screen.getByLabelText(/Subject/i);
    const messageTextarea = screen.getByLabelText(/Your message/i);
    const button = screen.getByRole('button', { name: /Prepare Sending/i });

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

  test('successful submission flow', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderWithToasterProvider(<ContactForm />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    const emailInput = screen.getByLabelText(/Your Email/i);
    const subjectInput = screen.getByLabelText(/Subject/i);
    const messageTextarea = screen.getByLabelText(/Your message/i);
    const button = screen.getByRole('button', { name: /Prepare Sending/i });

    // Initially disabled
    expect(button).toBeDisabled();

    await user.type(nameInput, 'Aragorn');
    await user.type(emailInput, 'king@gondor.me');
    await user.type(subjectInput, 'For Frodo!');
    await user.type(messageTextarea, 'The beacons are lit!');

    expect(button).toBeEnabled();
    expect(screen.getByText('Cast Sending')).toBeVisible();

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

    expect(screen.getByText('Prepare Sending')).toBeVisible();
    expect(button).toBeDisabled();
  });

  test('error submission flow', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Resend failure' }),
    });

    renderWithToasterProvider(<ContactForm />);

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
  });

  test('400, warning toast with backend fallback message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Invalid payload' }),
    });

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith('warning', 'Invalid payload');
    });
  });

  test('400, warning toast with default message when fallback missing', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({}),
    });

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith('warning', 'Please check the form fields and try again.');
    });
  });

  test('429, warning toast with default rate-limit message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({}),
    });

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith('warning', 'You can only send one message every 24 hours.');
    });
  });

  test('429, warning toast with backend fallback message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: 'Too many requests from this IP' }),
    });

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith('warning', 'Too many requests from this IP');
    });
  });
  test('500, error toast with backend fallback message (explicit 500 branch)', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    });

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith('error', 'Internal Server Error');
    });
  });

  test('502, error toast with default service-unavailable message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => ({}),
    });

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        'error',
        'Message service is temporarily unavailable. Please try again later, or use an alternative contact method.'
      );
    });
  });

  test('502, error toast respects backend fallback message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => ({ error: 'Resend outage' }),
    });

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith('error', 'Resend outage');
    });
  });

  test('unknown status, mapContactError default branch uses server message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 418,
      json: async () => ({ error: 'I am a teapot' }),
    });

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith('error', 'I am a teapot');
    });
  });

  test('unknown status without server message, mapContactError uses generic fallback', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 520,
      json: async () => ({}),
    });

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        'error',
        'Something went wrong. Please try again later, or use an alternative contact method.'
      );
    });
  });

  test('catch block: fetch throws Error, toast shows error.message', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network unreachable'));

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith('error', 'Network unreachable');
    });
  });

  test('catch block: fetch throws non-Error → toast uses generic fallback message', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce('totally unexpected');

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        'error',
        'Something went wrong. Try again later or use a different contact method.'
      );
    });
  });

  test('response.json() rejection triggers empty-object fallback', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    renderWithToasterProvider(<ContactForm />);
    await fillValidForm();

    await user.click(screen.getByRole('button', { name: /Cast Sending/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith('warning', 'Please check the form fields and try again.');
    });
  });
});
