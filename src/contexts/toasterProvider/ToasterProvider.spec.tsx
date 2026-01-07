import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { ToasterProvider } from './ToasterProvider';
import { useToast } from './useToast';

function TestToastButton() {
  const { toast } = useToast();
  return <button onClick={() => toast('success', 'Hello toast')}>Trigger toast</button>;
}
describe('ToasterProvider', () => {
  let user: UserEvent;
  beforeEach(() => {
    jest.useFakeTimers();
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  });

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  test('renders toast via portal into document.body', async () => {
    render(
      <ToasterProvider>
        <TestToastButton />
      </ToasterProvider>
    );

    await user.click(screen.getByText('Trigger toast'));

    const toast = await screen.findByText('Hello toast');
    expect(toast).toBeInTheDocument();

    // Portal assertion
    expect(document.body).toContainElement(toast);
  });

  test('auto-removes toast after calculated duration', async () => {
    render(
      <ToasterProvider>
        <TestToastButton />
      </ToasterProvider>
    );

    await user.click(screen.getByText('Trigger toast'));

    const toast = await screen.findByText('Hello toast');
    expect(toast).toBeVisible();

    // message length = 11
    // duration = 5000 + (11 * 50) = 5550
    await act(async () => {
      jest.advanceTimersByTime(5600);
    });

    expect(screen.queryByText('Hello toast')).not.toBeInTheDocument();
  });

  test('supports multiple stacked toasts', async () => {
    render(
      <ToasterProvider>
        <TestToastButton />
      </ToasterProvider>
    );

    await user.click(screen.getByText('Trigger toast'));
    await user.click(screen.getByText('Trigger toast'));

    const toasts = await screen.findAllByText('Hello toast');
    expect(toasts).toHaveLength(2);
  });
});
