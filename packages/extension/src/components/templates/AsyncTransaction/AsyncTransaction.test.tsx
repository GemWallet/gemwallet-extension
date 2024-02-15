import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrowserContext } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { AsyncTransaction } from './AsyncTransaction';
import { vi } from 'vitest';

describe('AsyncTransaction Template', () => {
  const user = userEvent.setup();

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
      const mockedCloseExtension = vi.fn();
      render(
        <BrowserContext.Provider value={{ closeExtension: mockedCloseExtension, window }}>
          <AsyncTransaction
            title="Signature in progress"
            subtitle="Please wait..."
            transaction={TransactionStatus.Waiting}
          />
        </BrowserContext.Provider>
      );
      expect(screen.getByRole('button', { name: 'Processing' })).not.toBeEnabled();
    });

    test('Should not call closeExtension when button is clicked for "pending"', () => {
      const mockedCloseExtension = vi.fn();
      render(
        <BrowserContext.Provider value={{ closeExtension: mockedCloseExtension, window }}>
          <AsyncTransaction
            title="Signature in progress"
            subtitle="Please wait..."
            transaction={TransactionStatus.Pending}
          />
        </BrowserContext.Provider>
      );
      expect(screen.getByRole('button', { name: 'Processing' })).not.toBeEnabled();
    });

    test('Should not call closeExtension when button is clicked for "success"', async () => {
      const mockedCloseExtension = vi.fn();
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
      await user.click(buttonElement);
      expect(mockedCloseExtension).toBeCalled();
    });

    test('Should not call closeExtension when button is clicked for "rejected"', async () => {
      const mockedCloseExtension = vi.fn();
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
      await user.click(buttonElement);
      expect(mockedCloseExtension).toBeCalled();
    });
  });
});
