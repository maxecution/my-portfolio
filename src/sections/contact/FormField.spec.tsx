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

    const label = screen.getByText(/My Field/i);
    expect(label).toHaveAttribute('for', 'my-field');

    const input = screen.getByLabelText(/My Field/i);
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'text');
    // autocomplete for input uses id
    expect(input).toHaveAttribute('autocomplete', 'off');

    expect(input).toBeRequired();

    await userEvent.type(input, TEST_TEXT);
    expect(baseProps.onChange).toHaveBeenCalledTimes(TEST_TEXT.length);
  });

  test('renders email input when type="email"', async () => {
    const onChange = jest.fn();
    render(
      <FormField
        id='email'
        label='Enter Email'
        type='email'
        required={false}
        placeholder='your@email.com'
        value=''
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText('Enter Email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).not.toBeRequired();
    expect(input).toHaveAttribute('placeholder', 'your@email.com');

    await userEvent.type(input, TEST_MAIL);
    expect(onChange).toHaveBeenCalledTimes(TEST_MAIL.length);
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
    expect(textarea).toHaveAttribute('autocomplete', 'off');
    expect(textarea).toHaveAttribute('rows', '5');

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

    const container = screen.getByTestId('form-field-container');
    expect(container).toHaveClass('container-extra');

    const label = screen.getByText(/My Field/i);
    expect(label).toHaveClass('label-extra');

    const input = screen.getByLabelText(/My Field/i);
    expect(input).toHaveClass('input-extra');
  });
});
