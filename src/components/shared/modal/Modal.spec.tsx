import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    document.body.style.overflow = '';
  });

  test('does not render the modal initially', () => {
    render(
      <Modal title='Test Modal' content={<p>Content</p>}>
        Open modal
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('opens the modal when trigger is clicked', async () => {
    render(
      <Modal title='Test Modal' content={<p>Content</p>}>
        Open modal
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('locks body scroll when modal opens and restores on close', async () => {
    render(
      <Modal title='Test Modal' content={<p>Content</p>}>
        Open modal
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /open modal/i }));
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(screen.getAllByRole('button', { name: /close/i })[0]);
    expect(document.body.style.overflow).toBe('');
  });

  test('moves focus into the modal on open', async () => {
    render(
      <Modal title='Test Modal' content={<button>Focusable</button>}>
        Open modal
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  test('traps focus within the modal when tabbing forward', async () => {
    render(
      <Modal
        title='Test Modal'
        content={
          <>
            <button>First</button>
            <button>Last</button>
          </>
        }>
        Open modal
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const closeIcon = screen.getByRole('button', { name: /close modal/i });
    const first = screen.getByRole('button', { name: 'First' });
    const last = screen.getByRole('button', { name: 'Last' });
    const closeButton = screen.getByRole('button', { name: /^close$/i });

    expect(closeIcon).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
    await user.tab();
    expect(last).toHaveFocus();
    await user.tab();
    expect(closeButton).toHaveFocus();
    await user.tab();
    expect(closeIcon).toHaveFocus();
  });

  test('traps focus within the modal when shift-tabbing backward', async () => {
    render(
      <Modal
        title='Test Modal'
        content={
          <>
            <button>First</button>
            <button>Last</button>
          </>
        }>
        Open modal
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const closeIcon = screen.getByRole('button', { name: /close modal/i });
    const closeButton = screen.getByRole('button', { name: /^close$/i });

    expect(closeIcon).toHaveFocus();
    await user.tab({ shift: true });
    expect(closeButton).toHaveFocus();
  });

  test('closes the modal when Escape is pressed', async () => {
    render(
      <Modal title='Test Modal' content={<p>Content</p>}>
        Open modal
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /open modal/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await act(async () => {
      await user.keyboard('{Escape}');
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('closes the modal via the close icon button', async () => {
    render(
      <Modal title='Test Modal' content={<p>Content</p>}>
        Open modal
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /open modal/i }));
    await user.click(screen.getByRole('button', { name: /close modal/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('closes the modal via the footer close button', async () => {
    render(
      <Modal title='Test Modal' content={<p>Content</p>}>
        Open modal
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const closeButton = screen.getAllByRole('button', { name: /^close$/i })[0];
    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('restores focus to the trigger button on close', async () => {
    render(
      <Modal title='Test Modal' content={<p>Content</p>}>
        Open modal
      </Modal>
    );

    const trigger = screen.getByRole('button', { name: /open modal/i });

    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });

  test('associates the dialog with its title for accessibility', async () => {
    render(
      <Modal title='Accessible Title' content={<p>Content</p>}>
        Open modal
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(screen.getByText('Accessible Title')).toHaveAttribute('id', 'modal-title');
  });
});
