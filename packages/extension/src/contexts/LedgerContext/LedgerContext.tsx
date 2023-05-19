import { useContext, createContext, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';
import { sign } from 'ripple-keypairs';
import { TransactionMetadata, Payment, Transaction, TrustSet } from 'xrpl';

import {
  AccountNFToken,
  NFTRequestPayload,
  PaymentRequestPayload,
  SetTrustlineRequestPayload
} from '@gemwallet/constants';

import { AccountTransaction } from '../../types';
import { toXRPLMemos } from '../../utils';
import { useNetwork } from '../NetworkContext';
import { useWallet } from '../WalletContext';

export interface GetNFTsResponse {
  account_nfts: AccountNFToken[];
  marker?: unknown;
}

export interface LedgerContextType {
  // Return transaction hash in case of success
  sendPayment: (payload: PaymentRequestPayload) => Promise<string>;
  setTrustline: (payload: SetTrustlineRequestPayload) => Promise<string>;
  signMessage: (message: string) => string | undefined;
  estimateNetworkFees: (payload: Transaction) => Promise<string>;
  getNFTs: (payload?: NFTRequestPayload) => Promise<GetNFTsResponse>;
  getTransactions: () => Promise<AccountTransaction[]>;
}

const LedgerContext = createContext<LedgerContextType>({
  sendPayment: () => new Promise(() => {}),
  setTrustline: () => new Promise(() => {}),
  signMessage: () => undefined,
  estimateNetworkFees: () =>
    new Promise((resolve) => {
      resolve('0');
    }),
  getNFTs: () =>
    new Promise(() => ({
      account_nfts: []
    })),
  getTransactions: () =>
    new Promise((resolve) => {
      resolve([]);
    })
});

const LedgerProvider: FC = ({ children }) => {
  const { client } = useNetwork();
  const { getCurrentWallet } = useWallet();

  /**
   * Returns the estimated network fees for a transaction, in drops
   * @param transaction The transaction to estimate the fees for
   * @returns The estimated fees, in drops
   */
  const estimateNetworkFees = useCallback(
    async (transaction: Transaction) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to make a transaction');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to make a transaction');
      } else {
        // Prepare the transaction
        const prepared = await client.autofill(transaction);
        if (!prepared.Fee) {
          throw new Error("Couldn't calculate the fees, something went wrong");
        } else {
          return prepared.Fee;
        }
      }
    },
    [client, getCurrentWallet]
  );

  const getNFTs = useCallback(
    async (payload?: NFTRequestPayload) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to get the NFTs');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to get the NFTs');
      } else {
        // Prepare the transaction
        const prepared = await client.request({
          command: 'account_nfts',
          account: wallet.publicAddress,
          limit: payload?.limit,
          marker: payload?.marker,
          ledger_index: 'validated'
        });
        if (!prepared.result?.account_nfts) {
          throw new Error("Couldn't get the NFTs");
        } else {
          return { account_nfts: prepared.result.account_nfts, marker: prepared.result.marker };
        }
      }
    },
    [client, getCurrentWallet]
  );

  const getTransactions = useCallback(async () => {
    const wallet = getCurrentWallet();
    if (!client) {
      throw new Error('You need to be connected to a ledger to make a transaction');
    } else if (!wallet) {
      throw new Error('You need to have a wallet connected to make a transaction');
    } else {
      // Prepare the transaction
      const prepared = await client.request({
        command: 'account_tx',
        account: wallet.publicAddress
      });
      if (!prepared.result?.transactions) {
        throw new Error("Couldn't get the transaction history");
      } else {
        return prepared.result.transactions;
      }
    }
  }, [client, getCurrentWallet]);

  const sendPayment = useCallback(
    async ({ amount, destination, memos, destinationTag, fee, flags }: PaymentRequestPayload) => {
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
            Amount: amount,
            Destination: destination,
            // Only add the Memos and DestinationTag fields if they are are defined, otherwise it would fail
            ...(memos && { Memos: toXRPLMemos(memos) }), // Each field of each memo is hex encoded
            ...(destinationTag &&
              Number(destinationTag) && { DestinationTag: Number(destinationTag) }),
            ...(fee && { Fee: fee }), // In drops
            ...(flags && { Flags: flags })
          });
          // Sign the transaction
          const signed = wallet.wallet.sign(prepared);
          // Submit the signed blob
          const tx = await client.submitAndWait(signed.tx_blob);
          if ((tx.result.meta! as TransactionMetadata).TransactionResult === 'tesSUCCESS') {
            return tx.result.hash;
          }
          throw new Error(
            (tx.result.meta as TransactionMetadata)?.TransactionResult ||
              `Something went wrong, we couldn't submit properly the transaction`
          );
        } catch (e) {
          if (
            (e as Error).message === 'checksum_invalid' ||
            (e as Error).message.includes('version_invalid') ||
            (e as Error).message === 'Non-base58 character'
          ) {
            throw new Error('The destination address is incorrect');
          } else if ((e as Error).message === 'tecUNFUNDED_PAYMENT') {
            throw new Error('Insufficient funds');
          } else if ((e as Error).message === 'tecNO_DST_INSUF_XRP') {
            throw new Error(
              'The account you are trying to make this transaction to does not exist, and the transaction is not sending enough XRP to create it.'
            );
          } else if ((e as Error).message === 'tecPATH_DRY') {
            throw new Error(
              'The transaction failed because the provided paths did not have enough liquidity to send anything at all. This could mean that the source and destination accounts are not linked by trust lines.'
            );
          } else if ((e as Error).message.includes('temREDUNDANT')) {
            throw new Error(
              'The transaction would do nothing; for example, it is sending a payment directly to the sending account, or creating an offer to buy and sell the same currency from the same issuer.'
            );
          } else {
            Sentry.captureException(e);
            throw e;
          }
        }
      }
    },
    [client, getCurrentWallet]
  );

  const setTrustline = useCallback(
    async ({ limitAmount, fee, memos, flags }: SetTrustlineRequestPayload) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to add a trustline');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to add a trustline');
      } else {
        // Prepare the transaction
        try {
          const prepared: TrustSet = await client.autofill({
            TransactionType: 'TrustSet',
            Account: wallet.publicAddress,
            Fee: fee, // In drops
            LimitAmount: limitAmount,
            ...(memos && { Memos: toXRPLMemos(memos) }), // Each field of each memo is hex encoded
            ...(flags && { Flags: flags })
          });
          // Sign the transaction
          const signed = wallet.wallet.sign(prepared);
          // Submit the signed blob
          const tx = await client.submitAndWait(signed.tx_blob);
          if ((tx.result.meta! as TransactionMetadata).TransactionResult === 'tesSUCCESS') {
            return tx.result.hash;
          }
          throw new Error(
            (tx.result.meta as TransactionMetadata)?.TransactionResult ||
              `Something went wrong, we couldn't add the trustline properly`
          );
        } catch (e) {
          if (
            (e as Error).message === 'checksum_invalid' ||
            (e as Error).message.includes('version_invalid') ||
            (e as Error).message === 'Non-base58 character'
          ) {
            throw new Error('The destination address is incorrect');
          } else if ((e as Error).message === 'tecUNFUNDED_PAYMENT') {
            throw new Error('Insufficient funds');
          } else if ((e as Error).message === 'tecNO_DST_INSUF_XRP') {
            throw new Error(
              'The account you are trying to make this transaction to does not exist, and the transaction is not sending enough XRP to create it.'
            );
          } else if ((e as Error).message.includes('Unsupported Currency representation')) {
            throw new Error('The currency is incorrect, you cannot add this trustline.');
          }
          Sentry.captureException(e);
          throw e;
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
    setTrustline,
    signMessage,
    estimateNetworkFees,
    getNFTs,
    getTransactions
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
