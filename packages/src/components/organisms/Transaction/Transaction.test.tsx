import { fireEvent, render, screen } from '@testing-library/react';
import { Transaction } from '.';
import { BrowserContext } from '../../../contexts/BrowserContext';

describe('Transaction Organism', () => {
  describe('Renders the proper elements', () => {
    test('Should render the proper elements for "waiting"', () => {
      const transaction = 'waiting';
      render(<Transaction transaction={transaction} />);
      const buttonElement = screen.getByRole('button', { name: 'Processing' });
      expect(buttonElement).toBeDisabled();
      expect(buttonElement).toBeVisible();
    });

    test('Should render the proper elements for "pending"', () => {
      const transaction = 'pending';
      render(<Transaction transaction={transaction} />);
      const buttonElement = screen.getByRole('button', { name: 'Processing' });
      expect(buttonElement).toBeDisabled();
      expect(buttonElement).toBeVisible();
    });

    test('Should render the proper elements for "success"', () => {
      const transaction = 'success';
      render(<Transaction transaction={transaction} />);
      const headingElement = screen.getByRole('heading', { name: 'Transaction accepted' });
      const buttonElement = screen.getByRole('button', { name: 'Close' });
      expect(headingElement).toBeVisible();
      expect(buttonElement).toBeVisible();
    });

    test('Should render the proper elements for "rejected"', () => {
      const transaction = 'rejected';
      render(<Transaction transaction={transaction} />);
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
      const transaction = 'waiting';
      const mockedCloseExtension = jest.fn();
      render(
        <BrowserContext.Provider value={{ closeExtension: mockedCloseExtension, window }}>
          <Transaction transaction={transaction} />
        </BrowserContext.Provider>
      );
      const buttonElement = screen.getByRole('button', { name: 'Processing' });
      fireEvent.click(buttonElement);
      expect(mockedCloseExtension).not.toBeCalled();
    });

    test('Should not call closeExtension when button is clicked for "pending"', () => {
      const transaction = 'pending';
      const mockedCloseExtension = jest.fn();
      render(
        <BrowserContext.Provider value={{ closeExtension: mockedCloseExtension, window }}>
          <Transaction transaction={transaction} />
        </BrowserContext.Provider>
      );
      const buttonElement = screen.getByRole('button', { name: 'Processing' });
      fireEvent.click(buttonElement);
      expect(mockedCloseExtension).not.toBeCalled();
    });

    test('Should not call closeExtension when button is clicked for "success"', () => {
      const transaction = 'success';
      const mockedCloseExtension = jest.fn();
      render(
        <BrowserContext.Provider value={{ closeExtension: mockedCloseExtension, window }}>
          <Transaction transaction={transaction} />
        </BrowserContext.Provider>
      );
      const buttonElement = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(buttonElement);
      expect(mockedCloseExtension).toBeCalled();
    });

    test('Should not call closeExtension when button is clicked for "rejected"', () => {
      const transaction = 'rejected';
      const mockedCloseExtension = jest.fn();
      render(
        <BrowserContext.Provider value={{ closeExtension: mockedCloseExtension, window }}>
          <Transaction transaction={transaction} />
        </BrowserContext.Provider>
      );
      const buttonElement = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(buttonElement);
      expect(mockedCloseExtension).toBeCalled();
    });
  });
});
