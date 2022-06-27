import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ImportSeed } from '.';
import App from '../../../App';
import { LedgerContext } from '../../../contexts/LedgerContext';
import { IMPORT_SEED_PATH } from '../../../constants';

const valueLedgerContext = {
  signIn: jest.fn(),
  generateWallet: jest.fn(),
  importSeed: () => true,
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
    checkTxSerialization: undefined,
    seed: '9u8y7gu4hiro8ygiyfhuoguisdf'
  }
};

describe('ImportSeed Page', () => {
  describe('Step 0 - Input Seed', () => {
    test('Should render the proper elements', () => {
      render(
        <BrowserRouter>
          <ImportSeed />
        </BrowserRouter>
      );
      const titleElement = screen.getByRole('heading', { name: 'Secret Seed' });
      const subTitleElement = screen.getByRole('heading', {
        name: 'Please enter your seed in order to load your wallet to GemWallet.'
      });
      expect(titleElement).toBeVisible();
      expect(subTitleElement).toBeVisible();
    });
  });

  describe('Step 1 - Create Password Screen', () => {
    test('Should render the proper elements', async () => {
      const renderedElements = render(
        <BrowserRouter>
          <LedgerContext.Provider value={valueLedgerContext}>
            <ImportSeed />
          </LedgerContext.Provider>
        </BrowserRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, {
        target: { value: 'snLBAMDHft26dD1ZJcKENAPVtqXFh' }
      });
      await user.click(nextButton);

      expect(screen.getByRole('heading', { name: 'Create a password' })).toBeVisible();
    });

    test('Should render an error if password is less than 8 characters', async () => {
      const renderedElements = render(
        <BrowserRouter>
          <LedgerContext.Provider value={valueLedgerContext}>
            <ImportSeed />
          </LedgerContext.Provider>
        </BrowserRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, {
        target: { value: 'snLBAMDHft26dD1ZJcKENAPVtqXFh' }
      });
      await user.click(nextButton);

      const passwordInput = renderedElements.container.querySelector('#password');
      const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
      fireEvent.change(passwordInput as Element, { target: { value: '1234567' } });
      fireEvent.change(passwordConfirmInput as Element, { target: { value: '1234567' } });
      await user.click(nextButton);
      expect(screen.getByText('Password must be at least 8 characters long')).toBeVisible();
    });

    test('Should render an error if passwords do not match', async () => {
      const renderedElements = render(
        <BrowserRouter>
          <LedgerContext.Provider value={valueLedgerContext}>
            <ImportSeed />
          </LedgerContext.Provider>
        </BrowserRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, {
        target: { value: 'snLBAMDHft26dD1ZJcKENAPVtqXFh' }
      });
      await user.click(nextButton);

      const passwordInput = renderedElements.container.querySelector('#password');
      const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
      fireEvent.change(passwordInput as Element, { target: { value: '12345678' } });
      fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345679' } });
      await user.click(nextButton);
      expect(screen.getByText('Passwords must match')).toBeVisible();
    });
  });

  describe('Step 2 - Follow Us Screen', () => {
    test('Should render the proper elements', async () => {
      const renderedElements = render(
        <BrowserRouter>
          <LedgerContext.Provider value={valueLedgerContext}>
            <ImportSeed />
          </LedgerContext.Provider>
        </BrowserRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, {
        target: { value: 'snLBAMDHft26dD1ZJcKENAPVtqXFh' }
      });
      await user.click(nextButton);

      // Going to Screen 2
      const passwordInput = renderedElements.container.querySelector('#password');
      const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
      fireEvent.change(passwordInput as Element, { target: { value: '12345678' } });
      fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345678' } });
      await user.click(nextButton);

      // Screen 3
      expect(screen.getByRole('heading', { name: "Woo, you're in!" })).toBeVisible();
    });

    test('Should navigate to transaction page', async () => {
      const renderedElements = render(
        <MemoryRouter
          initialEntries={[
            `${IMPORT_SEED_PATH}?chain=xrp&network=test&transaction=payment&amount=50&destination=rNhjf7Re4B9LvWiJwpGg1A1B1fWy4xh2Le&token=xrp&apiVersion=1`
          ]}
        >
          <LedgerContext.Provider value={valueLedgerContext}>
            <App />
          </LedgerContext.Provider>
        </MemoryRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, {
        target: { value: 'snLBAMDHft26dD1ZJcKENAPVtqXFh' }
      });
      await user.click(nextButton);

      // Going to Screen 2
      const passwordInput = renderedElements.container.querySelector('#password');
      const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
      fireEvent.change(passwordInput as Element, { target: { value: '12345678' } });
      fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345678' } });
      await user.click(nextButton);

      // Screen 3
      const finishButton = screen.getByRole('button', { name: 'Finish' });
      await user.click(finishButton);

      // Transaction Page
      expect(screen.getByText('Destination:')).toBeVisible();
    });

    test('Should navigate to home page', async () => {
      const renderedElements = render(
        <MemoryRouter initialEntries={[IMPORT_SEED_PATH]}>
          <LedgerContext.Provider value={valueLedgerContext}>
            <App />
          </LedgerContext.Provider>
        </MemoryRouter>
      );

      const nextButton = screen.getByRole('button', { name: 'Next' });
      const user = userEvent.setup();

      // Going to Screen 1
      const seedInput = renderedElements.container.querySelector('#seed');
      fireEvent.change(seedInput as Element, {
        target: { value: 'snLBAMDHft26dD1ZJcKENAPVtqXFh' }
      });
      await user.click(nextButton);

      // Going to Screen 2
      const passwordInput = renderedElements.container.querySelector('#password');
      const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
      fireEvent.change(passwordInput as Element, { target: { value: '12345678' } });
      fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345678' } });
      await user.click(nextButton);

      // Screen 3
      const finishButton = screen.getByRole('button', { name: 'Finish' });
      await user.click(finishButton);

      // Transaction Page
      expect(screen.getByText('Balance')).toBeVisible();
    });
  });

  test('Should go back', async () => {
    const renderedElements = render(
      <BrowserRouter>
        <LedgerContext.Provider value={valueLedgerContext}>
          <ImportSeed />
        </LedgerContext.Provider>
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });
    const user = userEvent.setup();

    // Going to Screen 1
    const seedInput = renderedElements.container.querySelector('#seed');
    fireEvent.change(seedInput as Element, {
      target: { value: 'snLBAMDHft26dD1ZJcKENAPVtqXFh' }
    });
    await user.click(nextButton);

    // Go back to Screen 0
    const backButton = screen.getByRole('button', { name: 'Back' });
    await user.click(backButton);

    const titleElement = screen.getByRole('heading', { name: 'Secret Seed' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'Please enter your seed in order to load your wallet to GemWallet.'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
