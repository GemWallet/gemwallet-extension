import { TransactionStatus } from '@gemwallet/api/src/constants/transaction.types';
import { useContext, useState, useEffect, createContext, FC } from 'react';
import * as xrpl from 'xrpl';
import { loadSeed } from '../../utils';

interface TransactionPayloadType {
  amount: string;
  destination: string;
}

interface ContextType {
  signIn: (password: string) => boolean;
  signOut: () => void;
  generateWallet: () => string | undefined;
  importSeed: (seed: string) => boolean;
  sendTransaction: (payload: TransactionPayloadType) => Promise<TransactionStatus>;
  estimateNetworkFees: (amount: string) => Promise<string>;
  wallet?: xrpl.Wallet;
  client?: xrpl.Client;
}

const LedgerContext = createContext<ContextType>({
  signIn: () => false,
  signOut: () => {},
  generateWallet: () => undefined,
  importSeed: () => false,
  sendTransaction: () => new Promise(() => {}),
  estimateNetworkFees: () =>
    new Promise((resolve) => {
      resolve('0');
    }),
  wallet: undefined,
  client: undefined
});

const LedgerProvider: FC = ({ children }) => {
  const [client, setClient] = useState<any>();
  const [wallet, setWallet] = useState<xrpl.Wallet | undefined>(undefined);

  const connectToNetwork = async () => {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    setClient(client);
  };

  useEffect(() => {
    // Connect to testnet network
    connectToNetwork();
  }, []);

  const signIn = (password: string) => {
    const seed = loadSeed(password);
    if (seed) {
      const wallet = xrpl.Wallet.fromSeed(seed);
      setWallet(wallet);
      return true;
    }
    return false;
  };

  const signOut = () => {
    setWallet(undefined);
  };

  const generateWallet = () => {
    const wallet = xrpl.Wallet.generate();
    setWallet(wallet);
    return wallet.seed;
  };

  const importSeed = (seed: string) => {
    try {
      const wallet = xrpl.Wallet.fromSeed(seed);
      setWallet(wallet);
      if (wallet.seed) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const estimateNetworkFees = async (amount: string) => {
    if (!client) {
      throw new Error('You need to be connected to a ledger to make a transaction');
    } else if (!wallet) {
      throw new Error('You need to have a wallet connected to make a transaction');
    } else {
      // Prepare the transaction
      const prepared = await client.autofill({
        TransactionType: 'Payment',
        Account: wallet.address,
        Amount: xrpl.xrpToDrops(amount)
      });
      return xrpl.dropsToXrp(prepared.Fee);
    }
  };

  const sendTransaction = async ({ amount, destination }: TransactionPayloadType) => {
    if (!client) {
      throw new Error('You need to be connected to a ledger to make a transaction');
    } else if (!wallet) {
      throw new Error('You need to have a wallet connected to make a transaction');
    } else {
      // Prepare the transaction
      const prepared = await client.autofill({
        TransactionType: 'Payment',
        Account: wallet.address,
        Amount: xrpl.xrpToDrops(amount),
        Destination: destination
      });
      // Sign the transaction
      const signed = wallet.sign(prepared);
      // Submit the signed blob
      const tx = await client.submitAndWait(signed.tx_blob);
      if (tx.result.meta.TransactionResult === 'tesSUCCESS') {
        return 'success';
      } else {
        return 'rejected';
      }
    }
  };

  const value: ContextType = {
    signIn,
    signOut,
    generateWallet,
    importSeed,
    sendTransaction,
    estimateNetworkFees,
    wallet,
    client
  };

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
};

const useLedger = (): ContextType => {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
};

export { LedgerProvider, LedgerContext, useLedger };
