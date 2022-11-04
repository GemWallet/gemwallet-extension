import { useContext, createContext, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';
import { sign } from 'ripple-keypairs';
import { xrpToDrops, dropsToXrp, TransactionMetadata, Payment } from 'xrpl';

import { PaymentRequestPayload } from '@gemwallet/constants';

import { useNetwork } from '../NetworkContext';
import { useWallet } from '../WalletContext';

export interface LedgerContextType {
  // Return transaction hash in case of success
  sendPayment: (payload: PaymentRequestPayload) => Promise<string>;
  signMessage: (message: string) => string | undefined;
  estimateNetworkFees: (payload: PaymentRequestPayload) => Promise<string>;
}

const LedgerContext = createContext<LedgerContextType>({
  sendPayment: () => new Promise(() => {}),
  signMessage: () => undefined,
  estimateNetworkFees: () =>
    new Promise((resolve) => {
      resolve('0');
    })
});

const LedgerProvider: FC = ({ children }) => {
  const { client } = useNetwork();
  const { getCurrentWallet } = useWallet();

  const estimateNetworkFees = useCallback(
    async ({ amount, destination }: PaymentRequestPayload) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to make a transaction');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to make a transaction');
      } else {
        // Prepare the transaction
        const prepared: Payment = await client.autofill({
          TransactionType: 'Payment',
          Account: wallet.publicAddress,
          Amount: xrpToDrops(amount),
          Destination: destination
        });
        if (!prepared.Fee) {
          throw new Error("Couldn't calculate the fees, something went wrong");
        } else {
          return dropsToXrp(prepared.Fee);
        }
      }
    },
    [client, getCurrentWallet]
  );

  const sendPayment = useCallback(
    async ({ amount, destination }: PaymentRequestPayload) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to make a transaction');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to make a transaction');
      } else {
        // Prepare the transaction
        try {
          const prepared: Payment = await client.autofill({
            TransactionType: 'Payment',
            Account: wallet.publicAddress,
            Amount: xrpToDrops(amount),
            Destination: destination
          });
          // Sign the transaction
          const signed = wallet.wallet.sign(prepared);
          // Submit the signed blob
          try {
            const tx = await client.submitAndWait(signed.tx_blob);
            if ((tx.result.meta! as TransactionMetadata).TransactionResult === 'tesSUCCESS') {
              return tx.result.hash;
            } else if (
              (tx.result.meta! as TransactionMetadata).TransactionResult === 'tecUNFUNDED_PAYMENT'
            ) {
              throw new Error('Insufficient funds');
            } else if (
              (tx.result.meta! as TransactionMetadata).TransactionResult === 'tecNO_DST_INSUF_XRP'
            ) {
              throw new Error(
                'The account you are trying to make this transaction to does not exist, and the transaction is not sending enough XRP to create it.'
              );
            } else {
              throw new Error(
                `Something went wrong, we couldn't submit properly the transaction - ${
                  (tx.result.meta! as TransactionMetadata).TransactionResult
                }`
              );
            }
          } catch (e) {
            Sentry.captureException(e);
            throw e;
          }
        } catch (e) {
          if (
            (e as Error).message === 'checksum_invalid' ||
            (e as Error).message.includes('version_invalid')
          ) {
            throw new Error('The destination address is incorrect');
          } else {
            Sentry.captureException(e);
            throw e;
          }
        }
      }
    },
    [client, getCurrentWallet]
  );

  const signMessage = useCallback(
    (message: string) => {
      const wallet = getCurrentWallet();
      try {
        if (!client) {
          throw new Error('You need to be connected to a ledger to sign a message');
        } else if (!wallet) {
          throw new Error('You need to have a wallet connected to sign a message');
        } else {
          const messageHex = Buffer.from(message, 'utf8').toString('hex');
          return sign(messageHex, wallet.wallet.privateKey);
        }
      } catch (e) {
        Sentry.captureException(e);
        throw e;
      }
    },
    [client, getCurrentWallet]
  );

  const value: LedgerContextType = {
    sendPayment,
    signMessage,
    estimateNetworkFees
  };

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
};

const useLedger = (): LedgerContextType => {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    const error = new Error('useLedger must be used within a LedgerProvider');
    Sentry.captureException(error);
    throw error;
  }
  return context;
};

export { LedgerProvider, LedgerContext, useLedger };
