import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconWrapper from './IconWrapper';

describe('IconWrapper Component', () => {
  const mockIcon = (
    <svg
      data-testid='mock-icon'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  );

  const size = 40;
  const additionalClass = 'custom-class';

  test('renders component with default size and no additional className', () => {
    render(<IconWrapper>{mockIcon}</IconWrapper>);

    const wrapperDiv = screen.getByTestId('mock-icon').parentElement as HTMLElement;

    expect(wrapperDiv).toHaveStyle({ width: '24px', height: '24px' });

    expect(wrapperDiv).not.toHaveClass(additionalClass);

    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeVisible();
  });

  test('renders component with correct size and additional className', () => {
    render(
      <IconWrapper size={size} className={additionalClass}>
        {mockIcon}
      </IconWrapper>
    );

    const wrapperDiv = screen.getByTestId('mock-icon').parentElement as HTMLElement;

    expect(wrapperDiv).toHaveStyle({ width: `${size}px`, height: `${size}px` });

    expect(wrapperDiv).toHaveClass(additionalClass);

    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeVisible();
  });
});
