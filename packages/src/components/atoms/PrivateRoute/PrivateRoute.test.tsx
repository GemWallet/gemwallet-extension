import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import * as xrpl from 'xrpl';
import { PrivateRoute } from '.';
import { LedgerContext } from '../../../contexts/LedgerContext';

describe('PrivateRoute Atom', () => {
  const defaultValue = {
    signIn: jest.fn(),
    generateWallet: jest.fn(),
    importSeed: jest.fn(),
    sendTransaction: jest.fn(),
    estimateNetworkFees: jest.fn()
  };
  test('Should redirect as wallet is found', () => {
    const wallet: xrpl.Wallet = {
      publicKey: '',
      privateKey: '',
      classicAddress: '',
      address: '',
      sign: jest.fn(),
      verifyTransaction: jest.fn(),
      getXAddress: jest.fn(),
      checkTxSerialization: undefined
    };

    render(
      <BrowserRouter>
        <LedgerContext.Provider value={{ ...defaultValue, wallet }}>
          <PrivateRoute>
            <div>Hello world!</div>
          </PrivateRoute>
        </LedgerContext.Provider>
      </BrowserRouter>
    );
    const childElement = screen.getByText('Hello world!');
    expect(childElement).toBeInTheDocument();
  });
});
