import { fireEvent, render, screen } from '@testing-library/react';

import { BrowserContext } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { AsyncTransaction } from './AsyncTransaction';

describe('AsyncTransaction Template', () => {
  describe('Renders the proper elements', () => {
    test('Should render the proper elements for "waiting"', () => {
      render(
        <AsyncTransaction
          title="Signature in progress"
          subtitle="Please wait..."
          transaction={TransactionStatus.Waiting}
        />
      );
      const buttonElement = screen.getByRole('button', { name: 'Processing' });
      expect(buttonElement).toBeDisabled();
      expect(buttonElement).toBeVisible();
    });

    test('Should render the proper elements for "pending"', () => {
      render(
        <AsyncTransaction
          title="Signature in progress"
          subtitle="Please wait..."
          transaction={TransactionStatus.Pending}
        />
      );
      const buttonElement = screen.getByRole('button', { name: 'Processing' });
      expect(buttonElement).toBeDisabled();
      expect(buttonElement).toBeVisible();
    });

    test('Should render the proper elements for "success"', () => {
      render(
        <AsyncTransaction
          title="Signature success"
          subtitle="Well done."
          transaction={TransactionStatus.Success}
        />
      );
      const headingElement = screen.getByRole('heading', { name: 'Signature success' });
      const buttonElement = screen.getByRole('button', { name: 'Close' });
      expect(headingElement).toBeVisible();
      expect(buttonElement).toBeVisible();
    });

    test('Should render the proper elements for "rejected"', () => {
      render(
        <AsyncTransaction
          title="Signature rejected"
          subtitle="User rejected the signature."
          transaction={TransactionStatus.Rejected}
        />
      );
      const headingElement = screen.getByRole('heading', { name: 'Signature rejected' });
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
          <AsyncTransaction
            title="Signature in progress"
            subtitle="Please wait..."
            transaction={TransactionStatus.Waiting}
          />
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
          <AsyncTransaction
            title="Signature in progress"
            subtitle="Please wait..."
            transaction={TransactionStatus.Pending}
          />
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
          <AsyncTransaction
            title="Signature success"
            subtitle="Well done."
            transaction={TransactionStatus.Success}
          />
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
          <AsyncTransaction
            title="Signature rejected"
            subtitle="User rejected the signature."
            transaction={TransactionStatus.Rejected}
          />
        </BrowserContext.Provider>
      );
      const buttonElement = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(buttonElement);
      expect(mockedCloseExtension).toBeCalled();
    });
  });
});
