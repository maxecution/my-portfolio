import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectCardTechStack from './ProjectCardTechStack';

function setElementHeights(el: HTMLElement, scrollHeight: number, clientHeight: number) {
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: scrollHeight });
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: clientHeight });
}

describe('ProjectCardTechStack', () => {
  const user = userEvent.setup();
  const techStack = ['React', 'TypeScript', 'Tailwind'];

  test('renders tech pills and modal when overflow occurs', async () => {
    const handleOpen = jest.fn();
    const handleClose = jest.fn();

    render(
      <ProjectCardTechStack
        techStack={techStack}
        isModalOpen={false}
        onModalOpen={handleOpen}
        onModalClose={handleClose}
      />
    );

    techStack.forEach((t) => expect(screen.getAllByText(t)[0]).toBeVisible());

    const sampleTech = screen.getByText('React');
    const container = sampleTech.parentElement as HTMLElement;

    act(() => {
      setElementHeights(container, 100, 10);
      window.dispatchEvent(new Event('resize'));
    });

    const button = screen.getByRole('button', { name: 'Show all technologies' });
    expect(button).toBeVisible();

    await user.click(button);
    expect(handleOpen).toHaveBeenCalled();
  });

  test('renders modal content when isModalOpen is true and closes via close button', async () => {
    const handleOpen = jest.fn();
    const handleClose = jest.fn();

    render(
      <ProjectCardTechStack
        techStack={techStack}
        isModalOpen={true}
        onModalOpen={handleOpen}
        onModalClose={handleClose}
      />
    );

    expect(screen.getByRole('heading', { name: 'Tech Stack' })).toBeVisible();

    const closeBtn = screen.getByRole('button', { name: 'Close modal' });
    await user.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  test('handles resize handler safely when containerRef is null', () => {
    let savedResizeFn: ((evt: Event) => void) | undefined;

    const originalAdd = window.addEventListener.bind(window);

    const addSpy = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(
        (
          type: string,
          listener: EventListenerOrEventListenerObject,
          options?: boolean | AddEventListenerOptions
        ): void => {
          if (type === 'resize') {
            if (typeof listener === 'function') {
              savedResizeFn = listener as (evt: Event) => void;
            } else {
              savedResizeFn = (evt: Event) => listener.handleEvent(evt);
            }
          }
          originalAdd(type, listener, options);
        }
      );

    const { unmount } = render(
      <ProjectCardTechStack techStack={techStack} isModalOpen={false} onModalOpen={() => {}} onModalClose={() => {}} />
    );

    unmount();

    expect(() => {
      savedResizeFn?.(new Event('resize'));
    }).not.toThrow();

    addSpy.mockRestore();
  });
});
