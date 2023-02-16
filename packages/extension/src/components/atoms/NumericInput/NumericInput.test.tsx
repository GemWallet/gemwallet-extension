import { render, fireEvent, screen } from '@testing-library/react';

import { NumericInput } from './NumericInput';

describe('NumericInput', () => {
  test('should update the input value when user types a valid number', () => {
    const onChange = jest.fn();
    render(<NumericInput onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123' } });
    expect(input).toHaveValue('123');
  });

  test('should not update the input value when user types an invalid number', () => {
    const onChange = jest.fn();
    render(<NumericInput onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input).toHaveValue('');
  });

  test('should allow float numbers', () => {
    const onChange = jest.fn();
    render(<NumericInput onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123.45' } });
    expect(input).toHaveValue('123.45');
  });
});
