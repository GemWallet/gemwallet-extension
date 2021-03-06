import { TransactionStatus } from '@gemwallet/api/src/constants/transaction.types';
import { useContext, useState, useEffect, createContext, FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Client, xrpToDrops, dropsToXrp } from 'xrpl';
import { HOME_PATH } from '../../constants';
import { WalletLedger } from '../../types';
import { loadWallets } from '../../utils';

interface TransactionPayloadType {
  amount: string;
  destination: string;
}

interface ContextType {
  signIn: (password: string) => boolean;
  signOut: () => void;
  generateWallet: () => Wallet | undefined;
  importSeed: (seed: string) => boolean;
  sendTransaction: (payload: TransactionPayloadType) => Promise<TransactionStatus>;
  estimateNetworkFees: (amount: string) => Promise<string>;
  wallets: WalletLedger[];
  selectedWallet: number;
  client?: Client;
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
  wallets: [],
  selectedWallet: 0,
  client: undefined
});

const LedgerProvider: FC = ({ children }) => {
  const navigate = useNavigate();
  const [client, setClient] = useState<any>();
  const [wallets, setWallets] = useState<WalletLedger[]>([]);
  // TODO: Use setSelectedWallet when multi-wallet creation and choosing feature will be done
  /* The default selectedWallet will be selected by a value in local storage
   * In order to be sure that the last selected wallet of the user stays the same
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedWallet, setSelectedWallet] = useState<number>(0);

  const connectToNetwork = async () => {
    // TODO: Put the websocket to constants and have some logic to switch from testnet to devnet to mainnet.
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    setClient(client);
  };

  useEffect(() => {
    // Connect to testnet network
    connectToNetwork();
  }, []);

  const signIn = useCallback((password: string) => {
    const wallets = loadWallets(password);
    if (wallets) {
      const _wallets = wallets.map(({ name, publicAddress, seed }) => {
        return {
          name,
          publicAddress,
          wallet: Wallet.fromSeed(seed)
        };
      });
      setWallets(_wallets);
      return true;
    }
    return false;
  }, []);

  const signOut = useCallback(() => {
    setWallets([]);
    navigate(HOME_PATH);
  }, [navigate]);

  // TODO: Name of the wallet should be asked to the user and passed here instead of generated
  const generateWallet = useCallback(() => {
    // TODO: Handle the failure of the generation
    const wallet = Wallet.generate();
    setWallets((wallets) => [
      ...wallets,
      {
        name: `Wallet ${wallets.length + 1}`,
        publicAddress: wallet.address,
        wallet
      }
    ]);
    return wallet;
  }, []);

  // TODO: Name of the wallet should be asked to the user and passed here instead of generated
  const importSeed = useCallback((seed: string) => {
    try {
      const wallet = Wallet.fromSeed(seed);
      setWallets((wallets) => [
        ...wallets,
        {
          name: `Wallet ${wallets.length + 1}`,
          publicAddress: wallet.address,
          wallet
        }
      ]);
      if (wallet.seed) {
        return true;
      }
      return false;
      // TODO: Properly handle that exception
    } catch {
      return false;
    }
  }, []);

  const estimateNetworkFees = useCallback(
    async (amount: string) => {
      if (!client) {
        throw new Error('You need to be connected to a ledger to make a transaction');
      } else if (!wallets?.[selectedWallet]) {
        throw new Error('You need to have a wallet connected to make a transaction');
      } else {
        // Prepare the transaction
        const prepared = await client.autofill({
          TransactionType: 'Payment',
          Account: wallets[selectedWallet].publicAddress,
          Amount: xrpToDrops(amount)
        });
        return dropsToXrp(prepared.Fee);
      }
    },
    [client, selectedWallet, wallets]
  );

  const sendTransaction = useCallback(
    async ({ amount, destination }: TransactionPayloadType) => {
      if (!client) {
        throw new Error('You need to be connected to a ledger to make a transaction');
      } else if (!wallets?.[selectedWallet]) {
        throw new Error('You need to have a wallet connected to make a transaction');
      } else {
        // Prepare the transaction
        const prepared = await client.autofill({
          TransactionType: 'Payment',
          Account: wallets[selectedWallet].publicAddress,
          Amount: xrpToDrops(amount),
          Destination: destination
        });
        // Sign the transaction
        const signed = wallets[selectedWallet].wallet.sign(prepared);
        // Submit the signed blob
        const tx = await client.submitAndWait(signed.tx_blob);
        if (tx.result.meta.TransactionResult === 'tesSUCCESS') {
          return 'success';
        } else {
          return 'rejected';
        }
      }
    },
    [client, selectedWallet, wallets]
  );

  const value: ContextType = {
    signIn,
    signOut,
    generateWallet,
    importSeed,
    sendTransaction,
    estimateNetworkFees,
    wallets,
    selectedWallet,
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
