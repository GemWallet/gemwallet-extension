import { useContext, createContext, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';
import { sign } from 'ripple-keypairs';
import {
  TransactionMetadata,
  Payment,
  Transaction,
  TrustSet,
  Wallet,
  NFTokenMint,
  NFTokenCreateOffer,
  NFTokenCancelOffer,
  NFTokenAcceptOffer
} from 'xrpl';
import { BaseTransaction } from 'xrpl/dist/npm/models/transactions/common';

import {
  AccountNFToken,
  MintNFTRequest,
  GetNFTRequest,
  SendPaymentRequest,
  SetTrustlineRequest,
  BaseTransactionRequest,
  CreateNFTOfferRequest,
  CancelNFTOfferRequest,
  AcceptNFTOfferRequest
} from '@gemwallet/constants';

import { AccountTransaction, WalletLedger } from '../../types';
import { toXRPLMemos, toXRPLSigners } from '../../utils';
import { useNetwork } from '../NetworkContext';
import { useWallet } from '../WalletContext';

interface GetNFTsResponse {
  account_nfts: AccountNFToken[];
  marker?: unknown;
}

interface MintNFTResponse {
  hash: string;
  NFTokenID: string;
}

interface FundWalletResponse {
  wallet: Wallet;
  balance: number;
}

interface CreateNFTOfferResponse {
  hash: string;
}

interface CancelNFTOfferResponse {
  hash: string;
}

interface AcceptNFTOfferResponse {
  hash: string;
}

export interface LedgerContextType {
  // Return transaction hash in case of success
  sendPayment: (payload: SendPaymentRequest) => Promise<string>;
  setTrustline: (payload: SetTrustlineRequest) => Promise<string>;
  signMessage: (message: string) => string | undefined;
  estimateNetworkFees: (payload: Transaction) => Promise<string>;
  getNFTs: (payload?: GetNFTRequest) => Promise<GetNFTsResponse>;
  getTransactions: () => Promise<AccountTransaction[]>;
  fundWallet: () => Promise<FundWalletResponse>;
  mintNFT: (payload: MintNFTRequest) => Promise<MintNFTResponse>;
  createNFTOffer: (payload: CreateNFTOfferRequest) => Promise<CreateNFTOfferResponse>;
  cancelNFTOffer: (payload: CancelNFTOfferRequest) => Promise<CancelNFTOfferResponse>;
  acceptNFTOffer: (payload: AcceptNFTOfferRequest) => Promise<AcceptNFTOfferResponse>;
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
    }),
  fundWallet: () => new Promise(() => {}),
  mintNFT: () => new Promise(() => {}),
  createNFTOffer: () => new Promise(() => {}),
  cancelNFTOffer: () => new Promise(() => {}),
  acceptNFTOffer: () => new Promise(() => {})
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
    async (payload?: GetNFTRequest): Promise<GetNFTsResponse> => {
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

  const mintNFT = useCallback(
    async (payload: MintNFTRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to mint an NFT');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to mint an NFT');
      } else {
        try {
          const tx = await client.submitAndWait(
            {
              ...(buildBaseTransaction(payload, wallet, 'NFTokenMint') as NFTokenMint),
              NFTokenTaxon: payload.NFTokenTaxon,
              ...(payload.issuer && { Issuer: payload.issuer }),
              ...(payload.transferFee && { TransferFee: payload.transferFee }),
              ...(payload.URI && { URI: payload.URI }), // Must be hex encoded
              ...(payload.flags && { Flags: payload.flags })
            },
            { wallet: wallet.wallet }
          );

          if (!tx.result.hash) {
            throw new Error("Couldn't mint the NFT");
          }

          const NFTokenID =
            tx.result.meta && typeof tx.result.meta === 'object' && 'nftoken_id' in tx.result.meta
              ? ((tx.result.meta as any).nftoken_id as string)
              : undefined;

          if (NFTokenID) {
            return {
              hash: tx.result.hash,
              NFTokenID
            };
          }

          if ((tx.result.meta! as TransactionMetadata).TransactionResult === 'tesSUCCESS') {
            throw new Error(
              "Couldn't fetch your NFT from the XRPL but the transaction was successful"
            );
          }

          throw new Error(
            (tx.result.meta as TransactionMetadata)?.TransactionResult ||
              "Something went wrong, we couldn't submit properly the transaction"
          );
        } catch (e) {
          Sentry.captureException(e);
          throw e;
        }
      }
    },
    [client, getCurrentWallet]
  );

  const sendPayment = useCallback(
    async ({ amount, destination, memos, destinationTag, fee, flags }: SendPaymentRequest) => {
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
      }
    },
    [client, getCurrentWallet]
  );

  const setTrustline = useCallback(
    async ({ limitAmount, fee, memos, flags }: SetTrustlineRequest) => {
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
        if (!wallet) {
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
    [getCurrentWallet]
  );

  const fundWallet = useCallback(async () => {
    const wallet = getCurrentWallet();
    try {
      if (!client) throw new Error('You need to be connected to a ledger to fund the wallet');
      if (!wallet) throw new Error('You need to have a wallet connected to fund the wallet');

      const walletWithAmount = await client.fundWallet(wallet.wallet);

      if (!walletWithAmount) throw new Error("Couldn't fund the wallet");

      return { ...walletWithAmount };
    } catch (e) {
      Sentry.captureException(e);
      throw e;
    }
  }, [client, getCurrentWallet]);

  const createNFTOffer = useCallback(
    async (payload: CreateNFTOfferRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(
            {
              ...(buildBaseTransaction(
                payload,
                wallet,
                'NFTokenCreateOffer'
              ) as NFTokenCreateOffer),
              NFTokenID: payload.NFTokenID,
              Amount: payload.amount,
              ...(payload.owner && { Owner: payload.owner }),
              ...(payload.expiration && { Expiration: payload.expiration }),
              ...(payload.destination && { Destination: payload.destination }),
              ...(payload.flags && { Flags: payload.flags })
            },
            { wallet: wallet.wallet }
          );

          if (!tx.result.hash) {
            throw new Error("Couldn't create the NFT offer");
          }

          if ((tx.result.meta! as TransactionMetadata).TransactionResult !== 'tesSUCCESS') {
            throw new Error(
              (tx.result.meta as TransactionMetadata)?.TransactionResult ||
                "Couldn't create the NFT offer but the transaction was successful"
            );
          }

          return {
            hash: tx.result.hash
          };
        } catch (e) {
          Sentry.captureException(e);
          throw e;
        }
      }
    },
    [client, getCurrentWallet]
  );

  const cancelNFTOffer = useCallback(
    async (payload: CancelNFTOfferRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(
            {
              ...(buildBaseTransaction(
                payload,
                wallet,
                'NFTokenCancelOffer'
              ) as NFTokenCancelOffer),
              NFTokenOffers: payload.NFTokenOffers
            },
            { wallet: wallet.wallet }
          );

          if (!tx.result.hash) {
            throw new Error("Couldn't cancel the NFT offer");
          }

          if ((tx.result.meta! as TransactionMetadata).TransactionResult !== 'tesSUCCESS') {
            throw new Error(
              (tx.result.meta as TransactionMetadata)?.TransactionResult ||
                "Couldn't cancel the NFT offer but the transaction was successful"
            );
          }

          return {
            hash: tx.result.hash
          };
        } catch (e) {
          Sentry.captureException(e);
          throw e;
        }
      }
    },
    [client, getCurrentWallet]
  );

  const acceptNFTOffer = useCallback(
    async (payload: AcceptNFTOfferRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to mint an NFT');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to mint an NFT');
      } else {
        try {
          const tx = await client.submitAndWait(
            {
              ...(buildBaseTransaction(
                payload,
                wallet,
                'NFTokenAcceptOffer'
              ) as NFTokenAcceptOffer),
              ...(payload.NFTokenSellOffer && { NFTokenSellOffer: payload.NFTokenSellOffer }),
              ...(payload.NFTokenBuyOffer && { NFTokenBuyOffer: payload.NFTokenBuyOffer }),
              ...(payload.NFTokenBrokerFee && { NFTokenBrokerFee: payload.NFTokenBrokerFee })
            },
            { wallet: wallet.wallet }
          );

          if (!tx.result.hash) {
            throw new Error("Couldn't accept the NFT offer");
          }

          if ((tx.result.meta! as TransactionMetadata).TransactionResult !== 'tesSUCCESS') {
            throw new Error(
              (tx.result.meta as TransactionMetadata)?.TransactionResult ||
                "Couldn't accept the NFT Offer but the transaction was successful"
            );
          }

          return {
            hash: tx.result.hash
          };
        } catch (e) {
          Sentry.captureException(e);
          throw e;
        }
      }
    },
    [client, getCurrentWallet]
  );

  const buildBaseTransaction = (
    payload: BaseTransactionRequest,
    wallet: WalletLedger,
    txType:
      | 'NFTokenMint'
      | 'Payment'
      | 'TrustSet'
      | 'NFTokenCreateOffer'
      | 'NFTokenCancelOffer'
      | 'NFTokenAcceptOffer'
  ): BaseTransaction => ({
    TransactionType: txType,
    Account: wallet.publicAddress,
    ...(payload.fee && { Fee: payload.fee }),
    ...(payload.sequence && { Sequence: payload.sequence }),
    ...(payload.accountTxnID && { AccountTxnID: payload.accountTxnID }),
    ...(payload.lastLedgerSequence && { LastLedgerSequence: payload.lastLedgerSequence }),
    ...(payload.memos && { Memos: toXRPLMemos(payload.memos) }), // Each field of each memo is hex encoded
    ...(payload.signers && { Signers: toXRPLSigners(payload.signers) }),
    ...(payload.sourceTag && { SourceTag: payload.sourceTag }),
    ...(payload.signingPubKey && { SigningPubKey: payload.signingPubKey }),
    ...(payload.ticketSequence && { TicketSequence: payload.ticketSequence }),
    ...(payload.txnSignature && { TxnSignature: payload.txnSignature })
  });

  const value: LedgerContextType = {
    sendPayment,
    setTrustline,
    signMessage,
    estimateNetworkFees,
    getNFTs,
    getTransactions,
    fundWallet,
    mintNFT,
    createNFTOffer,
    cancelNFTOffer,
    acceptNFTOffer
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
