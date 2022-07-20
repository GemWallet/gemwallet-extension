import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ConfirmSeed } from './ConfirmSeed';
import { WALLET_SEED, mockWallet } from '../../../../mocks';

const mockedSetActiveStep = jest.fn();

const defaultProps = {
  activeStep: 2,
  handleBack: jest.fn(),
  setActiveStep: mockedSetActiveStep,
  wallet: mockWallet
};

describe('CreateWallet - ConfirmSeed', () => {
  test('Should render the proper elements', async () => {
    render(
      <BrowserRouter>
        <ConfirmSeed {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: 'Confirm Your Secret Seed' })).toBeVisible();
  });

  test('Should render an error if seed is not confirmed', async () => {
    const renderedElements = render(
      <BrowserRouter>
        <ConfirmSeed {...defaultProps} />
      </BrowserRouter>
    );
    const user = userEvent.setup();

    const confirmButton = screen.getByRole('button', { name: 'Confirm' });
    await user.click(confirmButton);
    expect(screen.getByText('Seed incorrect')).toBeVisible();
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(0);

    const seedInput = renderedElements.container.querySelector('#seed');
    fireEvent.change(seedInput as Element, { target: { value: WALLET_SEED } });
    await user.click(confirmButton);
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(1);
  });
});
