import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NumericInput } from './NumericInput';

const user = userEvent.setup();

describe('NumericInput', () => {
  test('should update the input value when user types a valid number', async () => {
    const onChange = jest.fn();
    render(<NumericInput onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, '123');
    expect(input).toHaveValue('123');
  });

  test('should not update the input value when user types an invalid number', async () => {
    const onChange = jest.fn();
    render(<NumericInput onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'abc');
    expect(input).toHaveValue('');
  });

  test('should allow float numbers', async () => {
    const onChange = jest.fn();
    render(<NumericInput onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, '123.45');
    expect(input).toHaveValue('123.45');
  });
});
