// src/components/FormField.spec.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FormField from './FormField';

describe('FormField', () => {
  const baseProps = {
    id: 'my-field',
    label: 'My Field',
    value: '',
    onChange: jest.fn(),
  };
  const TEST_TEXT = 'hello';
  const TEST_MAIL = 'my@mail.com';
  const TEST_MSG = 'new message';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders default text input when type is omitted', async () => {
    render(<FormField {...baseProps} />);

    // Label exists and linked via htmlFor
    const label = screen.getByText(/My Field/i);
    expect(label).toHaveAttribute('for', 'my-field');

    // Input is rendered (default type === "text")
    const input = screen.getByLabelText(/My Field/i);
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'text');
    // autocomplete for input uses id
    expect(input).toHaveAttribute('autocomplete', 'my-field');

    // default required is true
    expect(input).toBeRequired();

    // onChange called with input event
    await userEvent.type(input, TEST_TEXT);
    expect(baseProps.onChange).toHaveBeenCalledTimes(TEST_TEXT.length);
  });

  test('renders email input when type="email"', async () => {
    render(<FormField {...baseProps} type='email' required={false} placeholder='your@email.com' value='foo' />);

    const input = screen.getByLabelText(/My Field/i);
    expect(input).toHaveAttribute('type', 'email');
    expect(input).not.toBeRequired();
    expect(input).toHaveAttribute('placeholder', 'your@email.com');

    // change event works
    await userEvent.type(input, TEST_MAIL);
    expect(baseProps.onChange).toHaveBeenCalledTimes(TEST_MAIL.length);
  });

  test('renders textarea when type="textarea"', async () => {
    const onChange = jest.fn();
    render(
      <FormField
        id='message'
        label='Message'
        type='textarea'
        placeholder='Write your message…'
        value='initial'
        onChange={onChange}
      />
    );

    const textarea = screen.getByLabelText(/Message/i);
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('placeholder', 'Write your message…');
    // textarea has autocomplete="off"
    expect(textarea).toHaveAttribute('autocomplete', 'off');
    // default rows=5
    expect(textarea).toHaveAttribute('rows', '5');

    // change event works
    await userEvent.type(textarea, TEST_MSG);
    expect(onChange).toHaveBeenCalledTimes(TEST_MSG.length);
  });

  test('merges container, label, and input class names', () => {
    render(
      <FormField
        {...baseProps}
        type='text'
        containerClassName='container-extra'
        labelClassName='label-extra'
        inputClassName='input-extra'
      />
    );

    const container = screen.getByText(/My Field/i).closest('div');
    expect(container).toHaveClass('container-extra');

    const label = screen.getByText(/My Field/i);
    expect(label).toHaveClass('label-extra');

    const input = screen.getByLabelText(/My Field/i);
    expect(input).toHaveClass('input-extra');
  });
});
