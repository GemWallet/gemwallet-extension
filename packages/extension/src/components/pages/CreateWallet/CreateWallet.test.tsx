import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { CreateWallet } from '.';
import App from '../../../App';
import { LedgerContext } from '../../../contexts/LedgerContext';
import { CREATE_NEW_WALLET_PATH } from '../../../constants';

describe('CreateWallet Page', () => {
  describe('Step 0 - Welcome Screen', () => {
    test('Should render the proper elements', () => {
      render(
        <BrowserRouter>
          <CreateWallet />
        </BrowserRouter>
      );
      const titleElement = screen.getByRole('heading', { name: 'Secret Seed' });
      const subTitleElement = screen.getByRole('heading', {
        name: 'This is the only way you will be able to recover your account. Please store it somewhere safe!'
      });
      expect(titleElement).toBeVisible();
      expect(subTitleElement).toBeVisible();
    });
  });

  describe('Step 1 - Confirm Seed Screen', () => {
    test('Should render the proper elements', async () => {
      render(
        <BrowserRouter>
          <CreateWallet />
        </BrowserRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      await user.click(nextButton);

      expect(screen.getByRole('heading', { name: 'Confirm Your Secret Seed' })).toBeVisible();
    });

    test('Should render an error if seed is not confirmed', async () => {
      const renderedElements = render(
        <BrowserRouter>
          <CreateWallet />
        </BrowserRouter>
      );
      const user = userEvent.setup();
      const nextButton = screen.getByRole('button', { name: 'Next' });

      // Going to Screen 1
      await user.click(nextButton);

      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      await user.click(confirmButton);
      expect(screen.getByText('Seed incorrect')).toBeVisible();

      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, { target: { value: 'Loading...' } });
      await user.click(confirmButton);
      expect(screen.queryByText('Seed incorrect')).toBeNull();
    });
  });

  describe('Step 2 - Create Password Screen', () => {
    test('Should render the proper elements', async () => {
      const renderedElements = render(
        <BrowserRouter>
          <CreateWallet />
        </BrowserRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      await user.click(nextButton);

      // Going to Screen 2
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, { target: { value: 'Loading...' } });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      await user.click(confirmButton);

      expect(screen.getByRole('heading', { name: 'Create a password' })).toBeVisible();
    });

    test('Should render an error if password is less than 8 characters', async () => {
      const renderedElements = render(
        <BrowserRouter>
          <CreateWallet />
        </BrowserRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      await user.click(nextButton);

      // Going to Screen 2
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, { target: { value: 'Loading...' } });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      await user.click(confirmButton);

      // Screen 3
      const passwordInput = renderedElements.container.querySelector('#password');
      const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
      fireEvent.change(passwordInput as Element, { target: { value: '1234567' } });
      fireEvent.change(passwordConfirmInput as Element, { target: { value: '1234567' } });
      await user.click(confirmButton);
      expect(screen.getByText('Password must be at least 8 characters long')).toBeVisible();
    });

    test('Should render an error if passwords do not match', async () => {
      const renderedElements = render(
        <BrowserRouter>
          <CreateWallet />
        </BrowserRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      await user.click(nextButton);

      // Going to Screen 2
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, { target: { value: 'Loading...' } });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      await user.click(confirmButton);

      // Screen 3
      const passwordInput = renderedElements.container.querySelector('#password');
      const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
      fireEvent.change(passwordInput as Element, { target: { value: '12345678' } });
      fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345679' } });
      await user.click(confirmButton);
      expect(screen.getByText('Passwords must match')).toBeVisible();

      fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345678' } });
      await user.click(confirmButton);
      expect(screen.queryByText('Passwords must match')).toBeNull();
    });
  });

  describe('Step 3 - Follow Us Screen', () => {
    test('Should render the proper elements', async () => {
      const renderedElements = render(
        <BrowserRouter>
          <CreateWallet />
        </BrowserRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      await user.click(nextButton);

      // Going to Screen 2
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, { target: { value: 'Loading...' } });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      await user.click(confirmButton);

      // Going to Screen 3
      const passwordInput = renderedElements.container.querySelector('#password');
      const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
      fireEvent.change(passwordInput as Element, { target: { value: '12345678' } });
      fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345678' } });
      await user.click(confirmButton);

      // Screen 4
      expect(screen.getByRole('heading', { name: "Woo, you're in!" })).toBeVisible();
    });

    test('Should navigate to transaction page', async () => {
      const defaultValue = {
        signIn: jest.fn(),
        generateWallet: jest.fn(),
        importSeed: jest.fn(),
        sendTransaction: jest.fn(),
        estimateNetworkFees: jest.fn(),
        wallet: {
          publicKey: '',
          privateKey: '',
          classicAddress: '',
          address: '',
          sign: jest.fn(),
          verifyTransaction: jest.fn(),
          getXAddress: jest.fn(),
          checkTxSerialization: undefined
        }
      };

      const renderedElements = render(
        <MemoryRouter
          initialEntries={[
            `${CREATE_NEW_WALLET_PATH}?chain=xrp&network=test&transaction=payment&amount=50&destination=rNhjf7Re4B9LvWiJwpGg1A1B1fWy4xh2Le&token=xrp&apiVersion=1`
          ]}
        >
          <LedgerContext.Provider value={defaultValue}>
            <App />
          </LedgerContext.Provider>
        </MemoryRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      await user.click(nextButton);

      // Going to Screen 2
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, { target: { value: 'Loading...' } });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      await user.click(confirmButton);

      // Going to Screen 3
      const passwordInput = renderedElements.container.querySelector('#password');
      const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
      fireEvent.change(passwordInput as Element, { target: { value: '12345678' } });
      fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345678' } });
      await user.click(confirmButton);

      // Screen 4
      const finishButton = screen.getByRole('button', { name: 'Finish' });
      await user.click(finishButton);

      // Transaction Page
      expect(screen.getByText('Destination:')).toBeVisible();
    });

    test('Should navigate to home page', async () => {
      const defaultValue = {
        signIn: jest.fn(),
        generateWallet: jest.fn(),
        importSeed: jest.fn(),
        sendTransaction: jest.fn(),
        estimateNetworkFees: jest.fn(),
        wallet: {
          publicKey: '',
          privateKey: '',
          classicAddress: '',
          address: '',
          sign: jest.fn(),
          verifyTransaction: jest.fn(),
          getXAddress: jest.fn(),
          checkTxSerialization: undefined
        }
      };

      const renderedElements = render(
        <MemoryRouter initialEntries={[CREATE_NEW_WALLET_PATH]}>
          <LedgerContext.Provider value={defaultValue}>
            <App />
          </LedgerContext.Provider>
        </MemoryRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      await user.click(nextButton);

      // Going to Screen 2
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, { target: { value: 'Loading...' } });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      await user.click(confirmButton);

      // Going to Screen 3
      const passwordInput = renderedElements.container.querySelector('#password');
      const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
      fireEvent.change(passwordInput as Element, { target: { value: '12345678' } });
      fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345678' } });
      await user.click(confirmButton);

      // Screen 4
      const finishButton = screen.getByRole('button', { name: 'Finish' });
      await user.click(finishButton);

      // Transaction Page
      expect(screen.getByText('Balance')).toBeVisible();
    });
  });

  test('Should go back', async () => {
    render(
      <BrowserRouter>
        <CreateWallet />
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });
    const user = userEvent.setup();

    // Going to Screen 1
    await user.click(nextButton);

    // Go back to Screen 0
    const backButton = screen.getByRole('button', { name: 'Back' });
    await user.click(backButton);

    const titleElement = screen.getByRole('heading', { name: 'Secret Seed' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'This is the only way you will be able to recover your account. Please store it somewhere safe!'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
