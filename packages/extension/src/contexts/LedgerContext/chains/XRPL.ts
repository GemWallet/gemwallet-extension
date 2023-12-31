import {
  Client,
  NFTokenMint,
  Transaction,
  TransactionMetadata,
  TxResponse,
  validate,
  Wallet as WalletXRPL
} from 'xrpl';

import { WalletLedger } from '../../../types';

export const handleTransaction = async (param: {
  transaction: Transaction;
  client?: Client | null;
  wallet?: WalletLedger;
  signOnly?: boolean;
  shouldCheck?: boolean;
}): Promise<{ hash?: string; signature?: string }> => {
  const { transaction, client, wallet, signOnly, shouldCheck } = param;

  if (!wallet) {
    throw new Error('You need to have a wallet connected');
  }

  if (shouldCheck) {
    if (!transaction.Account || transaction.Account === '') {
      transaction.Account = wallet.publicAddress;
    }
    validate(transaction as unknown as Record<string, unknown>);
  }

  // Sign only: prepare, sign, and return the blob without submitting
  if (signOnly) {
    let prepared = transaction;
    if (client) {
      prepared = await client.autofill(transaction);
    }

    const signed = wallet.wallet.sign(prepared);

    if (!signed.tx_blob) {
      throw new Error("Couldn't sign the transaction");
    }

    return { signature: signed.tx_blob };
  }

  // Sign and submit the transaction
  if (!client) {
    throw new Error('You need to be connected to a ledger for submitting the transaction');
  }

  // Prepare and submit the transaction using the `submit` function
  const tx = await submit({ transaction, client, wallet });

  // Return the transaction hash
  return { hash: tx.result.hash };
};

// Specific case for mintNFT where we also return the NFT ID
export const handleMintNFT = async (param: {
  transaction: NFTokenMint;
  client: Client;
  wallet: WalletLedger;
}): Promise<{ hash: string; NFTokenID: string }> => {
  const { transaction, client, wallet } = param;

  const tx = await submit({ transaction, client, wallet });
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
    throw new Error("Couldn't fetch your NFT from the XRPL but the transaction was successful");
  }

  throw new Error(
    (tx.result.meta as TransactionMetadata)?.TransactionResult ||
      "Something went wrong, we couldn't submit properly the transaction"
  );
};

export const calculateFees = async (param: {
  client: Client;
  transaction: Transaction;
}): Promise<string> => {
  const { client, transaction } = param;

  const prepared = await client.autofill(transaction);
  if (!prepared.Fee) {
    throw new Error("Couldn't calculate the fees, something went wrong");
  }

  return prepared.Fee;
};

const submit = async (param: {
  transaction: Transaction;
  client: Client;
  wallet: WalletLedger;
}): Promise<TxResponse<Transaction>> => {
  const { transaction, client, wallet } = param;

  // Prepare the transaction
  const prepared = await client.autofill(transaction);

  // Sign the transaction
  const signed = wallet.wallet.sign(prepared);

  // Submit the signed blob
  const tx = await client.submitAndWait(signed.tx_blob);

  if (!tx.result.hash) {
    throw new Error("Couldn't submit the transaction");
  }

  if ((tx.result.meta! as TransactionMetadata).TransactionResult === 'tesSUCCESS') {
    return tx;
  }

  throw new Error(
    (tx.result.meta as TransactionMetadata)?.TransactionResult ||
      `Something went wrong, we couldn't submit properly the transaction`
  );
};

export const fundWallet = async (param: {
  wallet: WalletLedger;
  client: Client;
}): Promise<{ wallet: WalletXRPL; balance: number }> => {
  const { wallet, client } = param;

  const walletWithAmount = await client.fundWallet(wallet.wallet);

  if (!walletWithAmount) throw new Error("Couldn't fund the wallet");

  return { ...walletWithAmount };
};
