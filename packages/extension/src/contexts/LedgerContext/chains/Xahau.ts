import { Client, NFTokenMint, setTransactionFlagsToNumber, Wallet as WalletXRPL } from 'xrpl';
import {
  DefinitionsData,
  XrplClient,
  XrplDefinitions,
  derive,
  sign,
  signAndSubmit,
  utils
} from 'xrpl-accountlib';

import {
  FAUCET_XAHAU_TESTNET,
  XahauNetwork,
  XahauTransaction,
  XRPLTransaction
} from '@gemwallet/constants';

import { WalletLedger } from '../../../types';

const FUNDING_AMOUNT = 10000;

/**
 * Helper function that is dedicated to signing or submitting a transaction to Xahau.
 * Since xrpl.js throws an 'Invalid TransactionType' error for Xahau specific transactions,
 * we use xrpl-accountlib for now.
 * Hence, shouldCheck parameter is not handled here.
 */
export const handleTransaction = async (param: {
  transaction: XahauTransaction;
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

  // Object flags are not supported for Xahau transactions, so we convert them to numbers
  // Since XahauTransaction does not embed flags objects yet, we can safely pass them as XRPLTransaction for now
  setTransactionFlagsToNumber(transaction as XRPLTransaction);

  try {
    const tx = {
      ...transaction,
      // Add: Sequence, Account, LastLedgerSequence, Fee (in case Hooks enabled: autodetect (from ledger))
      ...networkInfo.txValues
    };

    // Check if the transaction has a custom Fee
    // '0' means that the Fee must be dynamically calculated, so we don't keep it
    if (transaction.Fee && transaction.Fee !== '0') {
      // Retain the original custom Fee from transaction
      tx.Fee = transaction.Fee;
    }

    if (signOnly) {
      // Because the sign method from xrpl-accountlib does not fetch the definitions automatically -but signAndSubmit does-,
      // we fetch them manually here
      // Logic comes from: https://github.com/WietseWind/xrpl-accountlib/blob/master/src/sign/index.ts#L203
      const connection = new XrplClient(server);
      const definitions = (await connection.definitions()) ?? undefined;
      const signed = sign(tx, account, new XrplDefinitions(definitions as DefinitionsData));

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
  transaction: NFTokenMint;
  client: Client;
  wallet: WalletLedger;
}): Promise<{ hash: string; NFTokenID: string }> => {
  const { transaction, client, wallet } = param;

  return handleTransaction({ transaction, client, wallet })
    .then((result) => {
      return { hash: result.hash ?? '', NFTokenID: 'unknown' };
    })
    .catch((error) => {
      throw error;
    });
};

export const calculateFees = async (param: {
  transaction: XahauTransaction;
  client?: Client | null;
  wallet?: WalletLedger;
}): Promise<string> => {
  const { transaction, client, wallet } = param;
  if (!client || !wallet?.seed) throw new Error('You need to be connected to a ledger');

  const server = client.connection.getUrl();
  if (!server) throw new Error('You need to be connected to a ledger');

  // Object flags are not supported for Xahau transactions, so we convert them to numbers
  // Since XahauTransaction does not embed flags objects yet, we can safely pass them as XRPLTransaction for now
  setTransactionFlagsToNumber(transaction as XRPLTransaction);

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
