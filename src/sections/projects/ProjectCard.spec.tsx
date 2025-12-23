import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ProjectCardDetails } from '@data/projects/Projects.data';
import ProjectCard from './ProjectCard';

const sample: ProjectCardDetails = {
  title: 'Test Project',
  description: 'A demo project',
  techStack: ['React', 'Jest'],
  image: '/img.png',
  githubUrl: 'https://github.com/example',
  liveUrl: 'https://example.com',
  difficulty: 'Medium',
};

const modalHeader: string = 'Tech Stack';

describe('ProjectCard', () => {
  test('renders content and links', () => {
    render(<ProjectCard {...sample} />);

    expect(screen.getByRole('heading', { name: sample.title })).toBeVisible();

    expect(screen.getByText(sample.description)).toBeVisible();

    const img = screen.getByRole('img', {
      name: `${sample.title} image`,
    }) as HTMLImageElement;

    expect(img).toBeVisible();
    expect(img.src).toContain(sample.image);

    const codeLink = screen.getByRole('link', { name: 'Code' });
    const liveLink = screen.getByRole('link', { name: 'Live' });

    expect(codeLink).toHaveAttribute('href', sample.githubUrl);
    expect(liveLink).toHaveAttribute('href', sample.liveUrl);

    expect(screen.getByText(sample.difficulty)).toBeVisible();
  });

  test('opens tech stack modal and closes when expected', async () => {
    const user = userEvent.setup();

    const longSample = { ...sample, techStack: new Array(10).fill('Tech') };
    const addSpy = jest.spyOn(document, 'addEventListener');
    const removeSpy = jest.spyOn(document, 'removeEventListener');

    render(<ProjectCard {...longSample} />);

    const pill = screen.getAllByText('Tech')[0];
    const container = pill.parentElement as HTMLElement;

    Object.defineProperty(container, 'scrollHeight', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: 10,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    const openBtn = screen.getByRole('button', {
      name: 'Show all technologies',
    });

    await user.click(openBtn);

    // Modal should be visible
    expect(screen.getByRole('heading', { name: modalHeader })).toBeVisible();

    expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

    // Close via modal close button
    const closeBtn = screen.getByRole('button', {
      name: 'Close modal',
    });

    await user.click(closeBtn);

    expect(screen.queryByRole('heading', { name: modalHeader })).not.toBeInTheDocument();

    expect(removeSpy).toHaveBeenCalled();

    // Re-open modal to test outside click closes it
    await user.click(openBtn);

    expect(screen.getByRole('heading', { name: modalHeader })).toBeVisible();

    await user.click(document.body);

    expect(screen.queryByRole('heading', { name: modalHeader })).not.toBeInTheDocument();

    // Open again and click inside the card
    await user.click(openBtn);

    expect(screen.getByRole('heading', { name: modalHeader })).toBeVisible();

    const modalEl = screen.getByRole('heading', {
      name: modalHeader,
    });

    await user.click(modalEl);

    // Modal should remain open
    expect(screen.getByRole('heading', { name: modalHeader })).toBeVisible();
  });
});
