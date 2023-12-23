import { Client, NFTokenMint, Transaction, Wallet as WalletXRPL } from 'xrpl';
import { XrplClient, XrplDefinitions, derive, sign, signAndSubmit, utils } from 'xrpl-accountlib';

import { FAUCET_XAHAU_TESTNET, XahauNetwork } from '@gemwallet/constants';

import { WalletLedger } from '../../../types';
import { handleTransaction as handleTransactionXRPL } from './XRPL';

const MAINNET_NETWORK_ID = 21337;
const TESTNET_NETWORK_ID = 21338;

const FUNDING_AMOUNT = 10000;

/**
 * Helper function that is dedicated to signing or submitting a transaction to Xahau.
 * Since xrpl.js throws an 'Invalid TransactionType' error for Xahau specific transactions,
 * we use xrpl-accountlib for now.
 * Hence, shouldCheck parameter is not handled here.
 */
export const handleTransaction = async (param: {
  transaction: Transaction;
  client?: Client | null;
  wallet?: WalletLedger;
  signOnly?: boolean;
}): Promise<{ hash?: string; signature?: string }> => {
  const { client, wallet, signOnly, transaction } = param;

  const server = client?.connection.getUrl();
  if (!server) {
    throw new Error('You need to be connected to a ledger');
  }

  if (!wallet?.seed) {
    throw new Error('You need to have a wallet connected');
  }

  const account = derive.familySeed(wallet.seed);
  const networkInfo = await utils.txNetworkAndAccountValues(server, account);

  try {
    const tx = {
      ...transaction,
      // Add: Sequence, Account, LastLedgerSequence, Fee (in case Hooks enabled: autodetect (from ledger))
      ...networkInfo.txValues
    };

    if (signOnly) {
      // Because the sign method from xrpl-accountlib does not fetch the definitions automatically -but signAndSubmit does-,
      // we fetch them manually here
      // Logic comes from: https://github.com/WietseWind/xrpl-accountlib/blob/master/src/sign/index.ts#L203
      const connection = new XrplClient(server);
      const definitions = (await connection.definitions()) ?? undefined;
      const signed = sign(tx, account, new XrplDefinitions(definitions as any));

      if (!signed.signedTransaction) {
        throw new Error("Couldn't sign the transaction");
      }

      return { signature: signed.signedTransaction };
    }

    const submitted = await signAndSubmit(tx, server, account);

    if (!submitted.tx_id || !submitted.response.accepted || !submitted.response.applied) {
      throw new Error(
        'error_message' in submitted.response && submitted.response.error_message
          ? `Couldn't submit the transaction: ${submitted.response.engine_result_message}`
          : "Couldn't submit the transaction"
      );
    }

    return { hash: submitted.tx_id };
  } catch (error) {
    throw new Error(`Error signing transaction: ${error}`);
  }
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
  const { transaction } = params;
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

  const account = derive.familySeed(wallet.seed);
  const networkInfo = await utils.txNetworkAndAccountValues(server, account);
  const prepared = {
    ...transaction,
    // Add: Sequence, Account, LastLedgerSequence, Fee (in case Hooks enabled: autodetect (from ledger))
    ...networkInfo.txValues
  };

  try {
    return await utils.networkTxFee(server, prepared);
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
