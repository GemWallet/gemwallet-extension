import { Client, encode, NFTokenMint, Transaction, Wallet as WalletXRPL } from 'xrpl';
import { utils } from 'xrpl-accountlib';

import { FAUCET_XAHAU_TESTNET, XahauNetwork } from '@gemwallet/constants';

import { WalletLedger } from '../../../types';
import { handleTransaction as handleTransactionXRPL } from './XRPL';

const MAINNET_NETWORK_ID = 21337;
const TESTNET_NETWORK_ID = 21338;

const FUNDING_AMOUNT = 10000;

export const handleTransaction = async (param: {
  transaction: Transaction;
  client?: Client | null;
  wallet?: WalletLedger;
  signOnly?: boolean;
  shouldCheck?: boolean;
  networkName: string;
}): Promise<{ hash?: string; signature?: string }> => {
  const { client, wallet, signOnly, shouldCheck, networkName } = param;
  const txn = param.transaction;
  const transaction = await toXahauTransaction({ transaction: txn, client, wallet, networkName });

  return handleTransactionXRPL({ transaction, client, wallet, signOnly, shouldCheck });
};

// Specific case for mintNFT where we also return the NFT ID
export const handleMintNFT = async (param: {
  txn: NFTokenMint;
  client: Client;
  wallet: WalletLedger;
  networkName: string;
}): Promise<{ hash: string; NFTokenID: string }> => {
  const { txn, client, wallet, networkName } = param;
  const transaction = await toXahauTransaction({ transaction: txn, client, wallet, networkName });

  return handleTransactionXRPL({ transaction, client, wallet })
    .then((result) => {
      return { hash: result.hash ?? '', NFTokenID: 'unknown' };
    })
    .catch((error) => {
      throw error;
    });
};

const toXahauTransaction = async (params: {
  transaction: Transaction;
  client?: Client | null;
  wallet?: WalletLedger;
  networkName: string;
}): Promise<Transaction> => {
  const { transaction, client, wallet } = params;
  const res = { ...transaction };

  // In case the NetworkID is not set by the API consumer, we autofill it
  if (res.NetworkID === undefined) {
    switch (params.networkName) {
      case XahauNetwork.XAHAU_MAINNET:
        res.NetworkID = MAINNET_NETWORK_ID;
        break;
      case XahauNetwork.XAHAU_TESTNET:
        res.NetworkID = TESTNET_NETWORK_ID;
        break;
      default:
        throw new Error(`Unsupported network: ${params.networkName}`);
    }
  }

  res.Fee = await calculateFees({ transaction, client, wallet });

  return res;
};

export const calculateFees = async (param: {
  transaction: Transaction;
  client?: Client | null;
  wallet?: WalletLedger;
}): Promise<string> => {
  const { transaction, client, wallet } = param;
  if (!client || !wallet?.seed) throw new Error('You need to be connected to a ledger');

  const server = client.connection.getUrl();
  if (!server) throw new Error('You need to be connected to a ledger');

  const transactionCopy: Transaction = { ...transaction };
  const prepared = await client.autofill(transactionCopy);

  try {
    return await utils.networkTxFee(server, encode(prepared));
  } catch (error) {
    throw new Error(`Error calculating transaction fee: ${error}`);
  }
};

export const fundWallet = async (param: {
  wallet: WalletLedger;
  networkName: string;
}): Promise<{ wallet: WalletXRPL; balance: number }> => {
  const { wallet, networkName } = param;

  let faucetUrl = undefined;
  switch (networkName) {
    case XahauNetwork.XAHAU_TESTNET:
      faucetUrl = FAUCET_XAHAU_TESTNET;
      break;
    default:
      throw new Error('Unsupported network');
  }

  const response = await fetch(faucetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      destination: wallet.wallet.address
    })
  });

  if (!response.ok) {
    throw new Error(`Couldn't fund the wallet using ${faucetUrl} faucet`);
  }

  // The response does not contain the balance, so we return a fixed value
  return { wallet: wallet.wallet, balance: FUNDING_AMOUNT };
};
