import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import { ButtonOption, ButtonOptionProps } from './ButtonOption';

const defaultName = 'Option 1';
const defaultDescription = 'This is option 1';

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
  it('renders correctly', () => {
    renderButtonOption();
    expect(screen.getByText(defaultName)).toBeInTheDocument();
    expect(screen.getByText(defaultDescription)).toBeInTheDocument();
  });

  it('renders a check icon if the button option is selected', () => {
    renderButtonOption({ isSelected: true });
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
  });

  it('does not render a check icon if the button option is not selected', () => {
    renderButtonOption({ isSelected: false });
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  it('calls the onClick prop when the card is clicked', () => {
    const onClick = jest.fn();
    const { container } = renderButtonOption({ onClick });
    fireEvent.click(container.querySelector('.MuiPaper-root') as Element);
    expect(onClick).toHaveBeenCalled();
  });
});
