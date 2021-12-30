import { ReactNode, useContext, useState, useEffect, createContext } from 'react';
import * as xrpl from 'xrpl';

type payloadType = {
  amount: string;
  destination: string;
};

type contextType = {
  sendTransaction: (payload: payloadType) => Promise<string>;
  estimateNetworkFees: (amount: string) => Promise<string>;
  client?: xrpl.Client;
};

const LedgerContext = createContext<contextType>({
  sendTransaction: () => new Promise(() => {}),
  estimateNetworkFees: () =>
    new Promise((resolve) => {
      resolve('0');
    }),
  client: undefined
});

function LedgerProvider({ children }: { children: ReactNode }): JSX.Element {
  const [client, setClient] = useState<any>();
  const [wallet, setWallet] = useState<any>();

  const getWallet = () => {
    const wallet = xrpl.Wallet.fromSeed('ss1c9EtVNmr1yrfG95fRHcbQqqZri');
    setWallet(wallet);
  };

  const connectToNetwork = async () => {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    setClient(client);
  };

  useEffect(() => {
    // Get Credentials
    getWallet();
    // Connect to testnet network
    connectToNetwork();
  }, []);

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

  const sendTransaction = async ({ amount, destination }: payloadType) => {
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

  const value: contextType = {
    sendTransaction,
    estimateNetworkFees,
    client
  };

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

function useLedger(): contextType {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
}

export { LedgerProvider, useLedger };
