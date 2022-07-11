import { fireEvent, render, screen } from '@testing-library/react';
import { Transaction } from '.';
import { BrowserContext } from '../../../contexts/BrowserContext';
import { TransactionStatus } from '../../../types';

describe('Transaction Organism', () => {
  describe('Renders the proper elements', () => {
    test('Should render the proper elements for "waiting"', () => {
      render(<Transaction transaction={TransactionStatus.Waiting} />);
      const buttonElement = screen.getByRole('button', { name: 'Processing' });
      expect(buttonElement).toBeDisabled();
      expect(buttonElement).toBeVisible();
    });

    test('Should render the proper elements for "pending"', () => {
      render(<Transaction transaction={TransactionStatus.Pending} />);
      const buttonElement = screen.getByRole('button', { name: 'Processing' });
      expect(buttonElement).toBeDisabled();
      expect(buttonElement).toBeVisible();
    });

    test('Should render the proper elements for "success"', () => {
      render(<Transaction transaction={TransactionStatus.Success} />);
      const headingElement = screen.getByRole('heading', { name: 'Transaction accepted' });
      const buttonElement = screen.getByRole('button', { name: 'Close' });
      expect(headingElement).toBeVisible();
      expect(buttonElement).toBeVisible();
    });

    test('Should render the proper elements for "rejected"', () => {
      render(<Transaction transaction={TransactionStatus.Rejected} />);
      const headingElement = screen.getByRole('heading', { name: 'Transaction rejected' });
      const buttonElement = screen.getByRole('button', { name: 'Close' });
      expect(headingElement).toBeVisible();
      expect(buttonElement).toBeVisible();
    });
  });

  describe('Interacts with the context', () => {
    const window: chrome.windows.Window = {
      focused: false,
      alwaysOnTop: false,
      incognito: false,
      id: 1234
    };
    test('Should not call closeExtension when button is clicked for "waiting"', () => {
      const mockedCloseExtension = jest.fn();
      render(
        <BrowserContext.Provider value={{ closeExtension: mockedCloseExtension, window }}>
          <Transaction transaction={TransactionStatus.Waiting} />
        </BrowserContext.Provider>
      );
      const buttonElement = screen.getByRole('button', { name: 'Processing' });
      fireEvent.click(buttonElement);
      expect(mockedCloseExtension).not.toBeCalled();
    });

    test('Should not call closeExtension when button is clicked for "pending"', () => {
      const mockedCloseExtension = jest.fn();
      render(
        <BrowserContext.Provider value={{ closeExtension: mockedCloseExtension, window }}>
          <Transaction transaction={TransactionStatus.Pending} />
        </BrowserContext.Provider>
      );
      const buttonElement = screen.getByRole('button', { name: 'Processing' });
      fireEvent.click(buttonElement);
      expect(mockedCloseExtension).not.toBeCalled();
    });

    test('Should not call closeExtension when button is clicked for "success"', () => {
      const mockedCloseExtension = jest.fn();
      render(
        <BrowserContext.Provider value={{ closeExtension: mockedCloseExtension, window }}>
          <Transaction transaction={TransactionStatus.Success} />
        </BrowserContext.Provider>
      );
      const buttonElement = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(buttonElement);
      expect(mockedCloseExtension).toBeCalled();
    });

    test('Should not call closeExtension when button is clicked for "rejected"', () => {
      const mockedCloseExtension = jest.fn();
      render(
        <BrowserContext.Provider value={{ closeExtension: mockedCloseExtension, window }}>
          <Transaction transaction={TransactionStatus.Rejected} />
        </BrowserContext.Provider>
      );
      const buttonElement = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(buttonElement);
      expect(mockedCloseExtension).toBeCalled();
    });
  });
});
