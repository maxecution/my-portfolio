import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock SectionFade to avoid intersection observer complexities
jest.mock('@shared/sectionFade/SectionFade', () => ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
));

import Contact from './Contact';
import { contactIntro } from '@data/contact/Contact.data';

describe('Contact Component', () => {
  test('should render without crashing', () => {
    render(<Contact />);
    expect(screen.getByText(contactIntro.sectionHeader)).toBeVisible();
  });
});
