import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { projectIntro } from '@/data/projects/Projects.data';

// Mock Carousel and SectionFade
jest.mock('./Carousel', () => () => <div role='region'>carousel-mock</div>);
jest.mock('@shared/sectionFade/SectionFade', () => ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
));

import Projects from './Projects';

describe('Projects', () => {
  test('renders the projects section and includes the carousel', () => {
    render(<Projects />);
    expect(screen.getByText(projectIntro.sectionHeader)).toBeVisible();
    expect(screen.getByText(/carousel-mock/)).toBeInTheDocument();
  });
});
