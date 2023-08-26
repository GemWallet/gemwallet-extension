import { createContext, FC, useCallback, useContext } from 'react';

import * as Sentry from '@sentry/react';
import { sign } from 'ripple-keypairs';
import {
  AccountDelete,
  AccountSet,
  NFTokenAcceptOffer,
  NFTokenBurn,
  NFTokenCancelOffer,
  NFTokenCreateOffer,
  NFTokenMint,
  OfferCancel,
  OfferCreate,
  Payment,
  Transaction,
  TransactionMetadata,
  TrustSet,
  validate,
  Wallet
} from 'xrpl';
import { AccountInfoResponse } from 'xrpl/dist/npm/models/methods/accountInfo';
import { BaseTransaction } from 'xrpl/dist/npm/models/transactions/common';

import {
  AcceptNFTOfferRequest,
  AccountNFToken,
  AccountNFTokenResponse,
  BaseTransactionRequest,
  BurnNFTRequest,
  CancelNFTOfferRequest,
  CancelOfferRequest,
  CreateNFTOfferRequest,
  CreateOfferRequest,
  GetNFTRequest,
  MintNFTRequest,
  NFTData,
  NFTokenIDResponse,
  SendPaymentRequest,
  SetAccountRequest,
  SetTrustlineRequest,
  SubmitTransactionRequest
} from '@gemwallet/constants';

import { AccountTransaction, WalletLedger } from '../../types';
import { toXRPLMemos, toXRPLSigners } from '../../utils';
import { toUIError } from '../../utils/errors';
import { resolveNFTData } from '../../utils/NFTDataResolver';
import { useNetwork } from '../NetworkContext';
import { useWallet } from '../WalletContext';

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

interface BurnNFTResponse {
  hash: string;
}

interface SetAccountResponse {
  hash: string;
}

interface CreateOfferResponse {
  hash: string;
}

interface CancelOfferResponse {
  hash: string;
}

interface SubmitTransactionResponse {
  hash: string;
}

interface DeleteAccountResponse {
  hash: string;
}

interface NFTImageRequest {
  NFT: AccountNFToken;
}

export const LEDGER_CONNECTION_ERROR = 'You need to be connected to a ledger to make a transaction';

export interface LedgerContextType {
  // Return transaction hash in case of success
  sendPayment: (payload: SendPaymentRequest) => Promise<string>;
  setTrustline: (payload: SetTrustlineRequest) => Promise<string>;
  signMessage: (message: string) => string | undefined;
  estimateNetworkFees: (payload: Transaction) => Promise<string>;
  getNFTs: (payload?: GetNFTRequest) => Promise<AccountNFTokenResponse>;
  getTransactions: () => Promise<AccountTransaction[]>;
  fundWallet: () => Promise<FundWalletResponse>;
  mintNFT: (payload: MintNFTRequest) => Promise<NFTokenIDResponse>;
  createNFTOffer: (payload: CreateNFTOfferRequest) => Promise<CreateNFTOfferResponse>;
  cancelNFTOffer: (payload: CancelNFTOfferRequest) => Promise<CancelNFTOfferResponse>;
  acceptNFTOffer: (payload: AcceptNFTOfferRequest) => Promise<AcceptNFTOfferResponse>;
  burnNFT: (payload: BurnNFTRequest) => Promise<BurnNFTResponse>;
  setAccount: (payload: SetAccountRequest) => Promise<SetAccountResponse>;
  createOffer: (payload: CreateOfferRequest) => Promise<CreateOfferResponse>;
  cancelOffer: (payload: CancelOfferRequest) => Promise<CancelOfferResponse>;
  submitTransaction: (payload: SubmitTransactionRequest) => Promise<SubmitTransactionResponse>;
  getAccountInfo: (accountId?: string) => Promise<AccountInfoResponse>;
  getNFTData: (payload: NFTImageRequest) => Promise<NFTData>;
  deleteAccount: (destinationAddress: string) => Promise<DeleteAccountResponse>;
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
  acceptNFTOffer: () => new Promise(() => {}),
  burnNFT: () => new Promise(() => {}),
  setAccount: () => new Promise(() => {}),
  createOffer: () => new Promise(() => {}),
  cancelOffer: () => new Promise(() => {}),
  submitTransaction: () => new Promise(() => {}),
  getAccountInfo: () => new Promise(() => {}),
  getNFTData: () => new Promise(() => {}),
  deleteAccount: () => new Promise(() => {})
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
        throw new Error(LEDGER_CONNECTION_ERROR);
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
    async (payload?: GetNFTRequest): Promise<AccountNFTokenResponse> => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to get the NFTs');
      }
      if (!wallet) {
        throw new Error('You need to have a wallet connected to get the NFTs');
      }

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
      }

      return { account_nfts: prepared.result.account_nfts, marker: prepared.result.marker };
    },
    [client, getCurrentWallet]
  );

  const getTransactions = useCallback(async () => {
    const wallet = getCurrentWallet();
    if (!client) {
      throw new Error(LEDGER_CONNECTION_ERROR);
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
    async (payload: SendPaymentRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error(LEDGER_CONNECTION_ERROR);
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to make a transaction');
      } else {
        // Prepare the transaction
        const prepared: Payment = await client.autofill({
          ...(buildBaseTransaction(payload, wallet, 'Payment') as Payment),
          Amount: payload.amount,
          Destination: payload.destination,
          ...(payload.destinationTag &&
            Number(payload.destinationTag) && { DestinationTag: Number(payload.destinationTag) }),
          ...(payload.flags && { Flags: payload.flags })
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
    async (payload: SetTrustlineRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to add a trustline');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to add a trustline');
      } else {
        // Prepare the transaction
        try {
          const prepared: TrustSet = await client.autofill({
            ...(buildBaseTransaction(payload, wallet, 'TrustSet') as TrustSet),
            LimitAmount: payload.limitAmount,
            ...(payload.flags && { Flags: payload.flags })
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
          throw toUIError(e as Error);
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

  const burnNFT = useCallback(
    async (payload: BurnNFTRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(
            {
              ...(buildBaseTransaction(payload, wallet, 'NFTokenBurn') as NFTokenBurn),
              NFTokenID: payload.NFTokenID,
              ...(payload.owner && { Owner: payload.owner })
            },
            { wallet: wallet.wallet }
          );

          if (!tx.result.hash) {
            throw new Error("Couldn't burn the NFT");
          }

          if ((tx.result.meta! as TransactionMetadata).TransactionResult !== 'tesSUCCESS') {
            throw new Error(
              (tx.result.meta as TransactionMetadata)?.TransactionResult ||
                "Couldn't burn the NFT but the transaction was successful"
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

  const setAccount = useCallback(
    async (payload: SetAccountRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(
            {
              ...(buildBaseTransaction(payload, wallet, 'AccountSet') as AccountSet),
              ...(payload.flags && { Flags: payload.flags }),
              ...(payload.clearFlag && { ClearFlag: payload.clearFlag }),
              ...(payload.domain && { Domain: payload.domain }),
              ...(payload.emailHash && { EmailHash: payload.emailHash }),
              ...(payload.messageKey && { MessageKey: payload.messageKey }),
              ...(payload.NFTokenMinter && { NFTokenMinter: payload.NFTokenMinter }),
              ...(payload.setFlag && { SetFlag: payload.setFlag }),
              ...(payload.transferRate && { TransferRate: payload.transferRate }),
              ...(payload.tickSize && { TickSize: payload.tickSize })
            },
            { wallet: wallet.wallet }
          );

          if (!tx.result.hash) {
            throw new Error("Couldn't set the account");
          }

          if ((tx.result.meta! as TransactionMetadata).TransactionResult !== 'tesSUCCESS') {
            throw new Error(
              (tx.result.meta as TransactionMetadata)?.TransactionResult ||
                "Couldn't set the account but the transaction was successful"
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

  const createOffer = useCallback(
    async (payload: CreateOfferRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(
            {
              ...(buildBaseTransaction(payload, wallet, 'OfferCreate') as OfferCreate),
              ...(payload.flags && { Flags: payload.flags }),
              ...(payload.expiration && { Expiration: payload.expiration }),
              ...(payload.offerSequence && { OfferSequence: payload.offerSequence }),
              TakerGets: payload.takerGets,
              TakerPays: payload.takerPays
            },
            { wallet: wallet.wallet }
          );

          if (!tx.result.hash) {
            throw new Error("Couldn't create the offer");
          }

          if ((tx.result.meta! as TransactionMetadata).TransactionResult !== 'tesSUCCESS') {
            throw new Error(
              (tx.result.meta as TransactionMetadata)?.TransactionResult ||
                "Couldn't create the offer but the transaction was successful"
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

  const cancelOffer = useCallback(
    async (payload: CancelOfferRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(
            {
              ...(buildBaseTransaction(payload, wallet, 'OfferCancel') as OfferCancel),
              OfferSequence: payload.offerSequence
            },
            { wallet: wallet.wallet }
          );

          if (!tx.result.hash) {
            throw new Error("Couldn't cancel the offer");
          }

          if ((tx.result.meta! as TransactionMetadata).TransactionResult !== 'tesSUCCESS') {
            throw new Error(
              (tx.result.meta as TransactionMetadata)?.TransactionResult ||
                "Couldn't cancel the offer but the transaction was successful"
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

  const submitTransaction = useCallback(
    async (payload: SubmitTransactionRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      }
      if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          if (!payload.transaction.Account || payload.transaction.Account === '') {
            payload.transaction.Account = wallet.publicAddress;
          }

          // Validate the transaction
          validate(payload.transaction as unknown as Record<string, unknown>);
          // Prepare the transaction
          const prepared: Transaction = await client.autofill(payload.transaction);
          // Sign the transaction
          const signed = wallet.wallet.sign(prepared);
          // Submit the signed blob
          const tx = await client.submitAndWait(signed.tx_blob);

          if (!tx.result.hash) {
            throw new Error("Couldn't submit the transaction");
          }

          if ((tx.result.meta! as TransactionMetadata).TransactionResult !== 'tesSUCCESS') {
            throw new Error(
              (tx.result.meta as TransactionMetadata)?.TransactionResult ||
                "Couldn't submit the signed transaction but the transaction was successful"
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

  const getAccountInfo = useCallback(
    (accountId?: string): Promise<AccountInfoResponse> => {
      const wallet = getCurrentWallet();

      if (!client) throw new Error('You need to be connected to a ledger');
      const address = accountId || wallet?.publicAddress;
      if (!address)
        throw new Error(
          'You need to have a wallet connected or provide an account ID to get the account info'
        );

      try {
        return client.request({
          command: 'account_info',
          account: address,
          ledger_index: 'current'
        });
      } catch (e) {
        Sentry.captureException(e);
        throw e;
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
      | 'NFTokenBurn'
      | 'AccountSet'
      | 'OfferCreate'
      | 'OfferCancel'
      | 'AccountDelete'
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

  const getNFTData = useCallback(
    async ({ NFT }: NFTImageRequest) => {
      try {
        return resolveNFTData(NFT, getAccountInfo);
      } catch (e) {
        Sentry.captureException(e);
        throw e;
      }
    },
    [getAccountInfo]
  );

  const deleteAccount = useCallback(
    async (destinationAddress: string) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      }

      if (!wallet) {
        throw new Error('You need to have a wallet connected');
      }

      try {
        const tx = await client.submitAndWait(
          {
            ...(buildBaseTransaction({}, wallet, 'AccountDelete') as AccountDelete),
            Destination: destinationAddress
          },
          { wallet: wallet.wallet, autofill: true }
        );

        if (!tx.result.hash) {
          throw new Error("Couldn't delete the account");
        }

        if ((tx.result.meta! as TransactionMetadata).TransactionResult !== 'tesSUCCESS') {
          throw new Error(
            (tx.result.meta as TransactionMetadata)?.TransactionResult ||
              "Couldn't delete the account but the transaction was successfully submitted"
          );
        }

        return {
          hash: tx.result.hash
        };
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
    getTransactions,
    fundWallet,
    mintNFT,
    createNFTOffer,
    cancelNFTOffer,
    acceptNFTOffer,
    burnNFT,
    setAccount,
    createOffer,
    cancelOffer,
    submitTransaction,
    getAccountInfo,
    getNFTData,
    deleteAccount
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
