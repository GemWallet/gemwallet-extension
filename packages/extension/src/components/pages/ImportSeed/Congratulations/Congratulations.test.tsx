import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { Congratulations, CongratulationsProps } from './Congratulations';
import { generateWalletContext } from '../../../../mocks';
import {
  HOME_PATH,
  IMPORT_SEED_PATH,
  PARAMETER_TRANSACTION_PAYMENT,
  TRANSACTION_PATH
} from '../../../../constants';

const defaultProps: CongratulationsProps = {
  activeStep: 2,
  handleBack: jest.fn()
};

const mockWalletContext = generateWalletContext();
jest.mock('../../../../contexts', () => ({
  useWallet: () => mockWalletContext
}));

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useNavigate: () => mockedUsedNavigate
}));

describe('ImportSeed - Congratulations Page', () => {
  test('Should render the proper elements', async () => {
    render(
      <BrowserRouter>
        <Congratulations {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: "Woo, you're in!" })).toBeVisible();
  });

  test('Should navigate to transaction page', async () => {
    const search = `?${PARAMETER_TRANSACTION_PAYMENT}&amount=50&destination=rNhjf7Re4B9LvWiJwpGg1A1B1fWy4xh2Le`;
    render(
      <MemoryRouter initialEntries={[`${IMPORT_SEED_PATH}${search}`]}>
        <Congratulations {...defaultProps} />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const finishButton = screen.getByRole('button', { name: 'Finish' });
    await user.click(finishButton);

    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`${TRANSACTION_PATH}${search}`);
  });

  test('Should navigate to home page', async () => {
    const search = `?amount=50&destination=rNhjf7Re4B9LvWiJwpGg1A1B1fWy4xh2Le`;
    render(
      <MemoryRouter initialEntries={[`${IMPORT_SEED_PATH}${search}`]}>
        <Congratulations {...defaultProps} />
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const finishButton = screen.getByRole('button', { name: 'Finish' });
    await user.click(finishButton);

    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`${HOME_PATH}${search}`);
  });
});
