import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ButtonOption, ButtonOptionProps } from './ButtonOption';

const defaultName = 'Option 1';
const defaultDescription = 'This is option 1';

const user = userEvent.setup();

const renderButtonOption = (props?: Partial<ButtonOptionProps>) =>
  render(
    <ButtonOption
      name={props?.name || defaultName}
      description={props?.description || defaultDescription}
      isSelected={props?.isSelected}
      onClick={props?.onClick || jest.fn()}
    />
  );

describe('ButtonOption', () => {
  test('renders correctly', () => {
    renderButtonOption();
    expect(screen.getByText(defaultName)).toBeInTheDocument();
    expect(screen.getByText(defaultDescription)).toBeInTheDocument();
  });

  test('renders a check icon if the button option is selected', () => {
    renderButtonOption({ isSelected: true });
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
  });

  test('does not render a check icon if the button option is not selected', () => {
    renderButtonOption({ isSelected: false });
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  test('calls the onClick prop when the card is clicked', async () => {
    const onClick = jest.fn();
    const { container } = renderButtonOption({ onClick });
    await user.click(container.querySelector('.MuiPaper-root') as Element);
    expect(onClick).toHaveBeenCalled();
  });
});
