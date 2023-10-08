import { createContext, FC, useCallback, useContext } from 'react';

import * as Sentry from '@sentry/react';
import { sign } from 'ripple-keypairs';
import {
  AccountDelete,
  AccountSet,
  LedgerEntryRequest,
  LedgerEntryResponse,
  NFTInfoRequest,
  NFTokenAcceptOffer,
  NFTokenBurn,
  NFTokenCancelOffer,
  NFTokenCreateOffer,
  NFTokenMint,
  OfferCancel,
  OfferCreate,
  Payment,
  SubmitResponse,
  Transaction,
  TransactionMetadata,
  TrustSet,
  TxResponse,
  validate,
  Wallet
} from 'xrpl';
import { AccountInfoResponse } from 'xrpl/dist/npm/models/methods/accountInfo';
import { NFTInfoResponse } from 'xrpl/dist/npm/models/methods/nftInfo';

import {
  AccountNFToken,
  AccountNFTokenResponse,
  GetNFTRequest,
  Network,
  NFTData,
  NFTokenIDResponse,
  SetAccountRequest,
  SignTransactionRequest,
  SubmitTransactionRequest,
  SubmitBulkTransactionsRequest,
  TransactionBulkResponse,
  TransactionWithID,
  MAINNET_CLIO_NODES
} from '@gemwallet/constants';

import { AccountTransaction } from '../../types';
import { toUIError } from '../../utils/errors';
import { resolveNFTData } from '../../utils/NFTDataResolver';
import { useNetwork } from '../NetworkContext';
import { useWallet } from '../WalletContext';
import { buildBaseTransaction } from './utils';
import { connectToLedger } from './utils/connectToLedger';

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

interface SignTransactionResponse {
  signature: string;
}

interface NFTImageRequest {
  NFT: AccountNFToken;
}

interface SubmitBulkTransactionsResponse {
  txResults: TransactionBulkResponse[];
  hasError?: boolean;
}

export const LEDGER_CONNECTION_ERROR = 'You need to be connected to a ledger to make a transaction';

export interface LedgerContextType {
  // Return transaction hash in case of success
  sendPayment: (payload: Payment) => Promise<string>;
  setTrustline: (payload: TrustSet) => Promise<string>;
  signMessage: (message: string) => string | undefined;
  estimateNetworkFees: (payload: Transaction) => Promise<string>;
  getNFTs: (payload?: GetNFTRequest) => Promise<AccountNFTokenResponse>;
  getTransactions: () => Promise<AccountTransaction[]>;
  fundWallet: () => Promise<FundWalletResponse>;
  mintNFT: (payload: NFTokenMint) => Promise<NFTokenIDResponse>;
  createNFTOffer: (payload: NFTokenCreateOffer) => Promise<CreateNFTOfferResponse>;
  cancelNFTOffer: (payload: NFTokenCancelOffer) => Promise<CancelNFTOfferResponse>;
  acceptNFTOffer: (payload: NFTokenAcceptOffer) => Promise<AcceptNFTOfferResponse>;
  burnNFT: (payload: NFTokenBurn) => Promise<BurnNFTResponse>;
  setAccount: (payload: SetAccountRequest) => Promise<SetAccountResponse>;
  createOffer: (payload: OfferCreate) => Promise<CreateOfferResponse>;
  cancelOffer: (payload: OfferCancel) => Promise<CancelOfferResponse>;
  signTransaction: (payload: SignTransactionRequest) => Promise<SignTransactionResponse>;
  submitTransaction: (payload: SubmitTransactionRequest) => Promise<SubmitTransactionResponse>;
  submitBulkTransactions: (
    payload: SubmitBulkTransactionsRequest
  ) => Promise<SubmitBulkTransactionsResponse>;
  getAccountInfo: (accountId?: string) => Promise<AccountInfoResponse>;
  getNFTData: (payload: NFTImageRequest) => Promise<NFTData>;
  deleteAccount: (destinationAddress: string) => Promise<DeleteAccountResponse>;
  getNFTInfo: (NFTokenID: string, network?: string) => Promise<NFTInfoResponse>;
  getLedgerEntry: (ID: string) => Promise<LedgerEntryResponse>;
}

const LedgerContext = createContext<LedgerContextType>({
  sendPayment: () => new Promise(() => {}),
  setTrustline: () => new Promise(() => {}),
  signMessage: () => undefined,
  estimateNetworkFees: () => Promise.resolve('0'),
  getNFTs: () =>
    new Promise(() => ({
      account_nfts: []
    })),
  getTransactions: () => Promise.resolve([]),
  fundWallet: () => new Promise(() => {}),
  mintNFT: () => new Promise(() => {}),
  createNFTOffer: () => new Promise(() => {}),
  cancelNFTOffer: () => new Promise(() => {}),
  acceptNFTOffer: () => new Promise(() => {}),
  burnNFT: () => new Promise(() => {}),
  setAccount: () => new Promise(() => {}),
  createOffer: () => new Promise(() => {}),
  cancelOffer: () => new Promise(() => {}),
  signTransaction: () => new Promise(() => {}),
  submitTransaction: () => new Promise(() => {}),
  submitBulkTransactions: () => new Promise(() => {}),
  getAccountInfo: () => new Promise(() => {}),
  getNFTData: () => new Promise(() => {}),
  deleteAccount: () => new Promise(() => {}),
  getNFTInfo: () => new Promise(() => {}),
  getLedgerEntry: () => new Promise(() => {})
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
    async (payload: NFTokenMint) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to mint an NFT');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to mint an NFT');
      } else {
        try {
          const tx = await client.submitAndWait(payload, { wallet: wallet.wallet });

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
    async (payload: Payment) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error(LEDGER_CONNECTION_ERROR);
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to make a transaction');
      } else {
        // Prepare the transaction
        const prepared: Payment = await client.autofill(payload);
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
    async (payload: TrustSet) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger to add a trustline');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected to add a trustline');
      } else {
        // Prepare the transaction
        try {
          const prepared: TrustSet = await client.autofill(payload);
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
    async (payload: NFTokenCreateOffer) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(payload, { wallet: wallet.wallet });

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
    async (payload: NFTokenCancelOffer) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(payload, { wallet: wallet.wallet });

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
    async (payload: NFTokenAcceptOffer) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(payload, { wallet: wallet.wallet });

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
    async (payload: NFTokenBurn) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(payload, { wallet: wallet.wallet });

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
    async (payload: OfferCreate) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(payload, { wallet: wallet.wallet });

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
    async (payload: OfferCancel) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      } else if (!wallet) {
        throw new Error('You need to have a wallet connected');
      } else {
        try {
          const tx = await client.submitAndWait(payload, { wallet: wallet.wallet });

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

  const processTransaction = useCallback(
    async (
      payload: SubmitTransactionRequest | SignTransactionRequest,
      signOnly = false
    ): Promise<SubmitTransactionResponse | SignTransactionResponse> => {
      const wallet = getCurrentWallet();
      if (!wallet) {
        throw new Error('You need to have a wallet connected');
      }
      if (!signOnly) {
        if (!client) {
          throw new Error('You need to be connected to a ledger');
        }
      }

      // Ensure the transaction has an Account or set it to the wallet's public address
      if (!payload.transaction.Account || payload.transaction.Account === '') {
        payload.transaction.Account = wallet.publicAddress;
      }

      // Validate the transaction
      validate(payload.transaction as unknown as Record<string, unknown>);

      // Prepare the transaction if needed
      let prepared: Transaction = payload.transaction;
      if (!signOnly && client) {
        prepared = await client.autofill(payload.transaction);
      }

      // Sign the transaction
      const signed = wallet.wallet.sign(prepared);

      if (!signed.tx_blob) {
        throw new Error("Couldn't sign the transaction");
      }

      // Handle signing-only case
      if (signOnly) {
        return {
          signature: signed.tx_blob
        };
      }

      // Ensure client is available for submission
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      }

      // Submit the signed transaction
      const tx = await client.submitAndWait(signed.tx_blob);

      if (!tx.result.hash) {
        throw new Error("Couldn't submit the transaction");
      }

      const transactionResult = (tx.result.meta! as TransactionMetadata)?.TransactionResult;
      if (transactionResult !== 'tesSUCCESS') {
        throw new Error(
          transactionResult ||
            "Couldn't submit the signed transaction but the transaction was successful"
        );
      }

      return {
        hash: tx.result.hash
      };
    },
    [client, getCurrentWallet]
  );

  const submitTransaction = useCallback(
    async (payload: SubmitTransactionRequest) => {
      try {
        return (await processTransaction(payload)) as SubmitTransactionResponse;
      } catch (e) {
        Sentry.captureException(e);
        throw e;
      }
    },
    [processTransaction]
  );

  const signTransaction = useCallback(
    async (payload: SignTransactionRequest) => {
      try {
        return (await processTransaction(payload, true)) as SignTransactionResponse;
      } catch (e) {
        Sentry.captureException(e);
        throw e;
      }
    },
    [processTransaction]
  );

  const submitBulkTransactions = useCallback(
    async (payload: SubmitBulkTransactionsRequest) => {
      const wallet = getCurrentWallet();
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      }
      if (!wallet) {
        throw new Error('You need to have a wallet connected');
      }

      const processTransaction = async (txWithID: TransactionWithID) => {
        const { ID, ...pl } = txWithID;

        if (!pl.Account || txWithID.Account === '') {
          pl.Account = wallet.publicAddress;
        }

        try {
          // Validate the transaction
          validate(pl as unknown as Record<string, unknown>);
          // Prepare the transaction
          const prepared: Transaction = await client.autofill(pl);
          // Sign the transaction
          const signed = wallet.wallet.sign(prepared);
          // Submit the signed blob based on the mode
          const tx = payload.waitForHashes
            ? await client.submitAndWait(signed.tx_blob)
            : await client.submit(signed.tx_blob);

          if (!payload.waitForHashes) {
            // Throttle the requests
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          // Check transaction result
          if (!payload.waitForHashes && !(tx as SubmitResponse).result.accepted) {
            throw new Error("Couldn't submit the transaction");
          }

          if (
            payload.waitForHashes &&
            (!(tx as TxResponse).result.hash ||
              ((tx as TxResponse).result.meta! as TransactionMetadata).TransactionResult !==
                'tesSUCCESS')
          ) {
            throw new Error(
              "Couldn't submit the signed transaction but the transaction was successful"
            );
          }

          return {
            id: ID,
            hash: payload.waitForHashes ? (tx as TxResponse).result.hash : undefined,
            accepted: !payload.waitForHashes ? true : undefined
          };
        } catch (e) {
          Sentry.captureException(e);
          return {
            id: ID,
            error: `Error while processing the transaction: ${JSON.stringify(e)}`
          };
        }
      };

      const { onError, transactions } = payload;
      const results: TransactionBulkResponse[] = [];
      for (const tx of transactions) {
        const result = await processTransaction(tx);
        results.push(result);

        if (result.error && onError === 'abort') {
          break;
        }
      }

      const hasError = results.some((r) => r.error);

      return { txResults: results, hasError };
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

  const getNFTInfo = useCallback(
    async (NFTokenID: string, network?: string): Promise<NFTInfoResponse> => {
      if (!client) throw new Error('You need to be connected to a ledger');

      try {
        if (network === Network.MAINNET) {
          // Connect to Clio server for mainnet
          let clioClient;
          try {
            clioClient = await connectToLedger(MAINNET_CLIO_NODES[0]);
          } catch {
            clioClient = await connectToLedger(MAINNET_CLIO_NODES[1]).catch(() => {
              throw new Error("Couldn't connect to a Clio server");
            });
          }
          return clioClient.request({
            command: 'nft_info',
            nft_id: NFTokenID
          } as NFTInfoRequest);
        }

        // Fallback, will probably fail since it's probably not a Clio server
        return client.request({
          command: 'nft_info',
          nft_id: NFTokenID
        } as NFTInfoRequest);
      } catch (e) {
        Sentry.captureException(e);
        throw e;
      }
    },
    [client]
  );

  const getLedgerEntry = useCallback(
    async (ID: string): Promise<LedgerEntryResponse> => {
      if (!client) throw new Error('You need to be connected to a ledger');

      try {
        return client.request({
          command: 'ledger_entry',
          index: ID,
          ledger_index: 'validated'
        } as LedgerEntryRequest);
      } catch (e) {
        Sentry.captureException(e);
        throw e;
      }
    },
    [client]
  );

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
        if ((e as Error).message.includes('tecTOO_SOON')) {
          throw new Error('tecTOO_SOON');
        }
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
    signTransaction,
    submitTransaction,
    submitBulkTransactions,
    getAccountInfo,
    getNFTData,
    deleteAccount,
    getNFTInfo,
    getLedgerEntry
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
