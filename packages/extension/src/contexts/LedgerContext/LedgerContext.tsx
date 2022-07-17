import { useContext, useState, useEffect, createContext, FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Client, xrpToDrops, dropsToXrp, TransactionMetadata, Payment } from 'xrpl';
import { Payment as PaymentPayload } from '@gemwallet/api';
import { HOME_PATH, TESTNET_RIPPLE } from '../../constants';
import { WalletLedger } from '../../types';
import { loadWallets } from '../../utils';

interface ContextType {
  signIn: (password: string) => boolean;
  signOut: () => void;
  generateWallet: (walletName?: string) => Wallet;
  importSeed: (seed: string, walletName?: string) => boolean;
  // Return transaction hash in case of success
  sendPayment: (payload: PaymentPayload) => Promise<string>;
  estimateNetworkFees: (payload: PaymentPayload) => Promise<string>;
  wallets: WalletLedger[];
  selectedWallet: number;
  client?: Client;
}

const LedgerContext = createContext<ContextType>({
  signIn: () => false,
  signOut: () => {},
  generateWallet: () => Wallet.generate(),
  importSeed: () => false,
  sendPayment: () => new Promise(() => {}),
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
  const [client, setClient] = useState<Client | undefined>();
  const [wallets, setWallets] = useState<WalletLedger[]>([]);
  // TODO: Use setSelectedWallet when multi-wallet creation and choosing feature will be done
  /* The default selectedWallet will be selected by a value in local storage
   * In order to be sure that the last selected wallet of the user stays the same
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedWallet, setSelectedWallet] = useState<number>(0);

  const connectToNetwork = async () => {
    const client = new Client(TESTNET_RIPPLE);
    await client.connect();
    setClient(client);
  };

  useEffect(() => {
    // Connect to testnet network
    connectToNetwork();
  }, []);

  const signIn = useCallback((password: string) => {
    const wallets = loadWallets(password);
    if (wallets.length) {
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

  const generateWallet = useCallback((walletName?: string) => {
    const wallet = Wallet.generate();
    setWallets((wallets) => [
      ...wallets,
      {
        name: walletName || `Wallet ${wallets.length + 1}`,
        publicAddress: wallet.address,
        wallet
      }
    ]);
    return wallet;
  }, []);

  const importSeed = useCallback((seed: string, walletName?: string) => {
    try {
      const wallet = Wallet.fromSeed(seed);
      setWallets((wallets) => [
        ...wallets,
        {
          name: walletName || `Wallet ${wallets.length + 1}`,
          publicAddress: wallet.address,
          wallet
        }
      ]);
      if (wallet.seed) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const estimateNetworkFees = useCallback(
    async ({ amount, destination }: PaymentPayload) => {
      if (!client) {
        throw new Error('You need to be connected to a ledger to make a transaction');
      } else if (!wallets?.[selectedWallet]) {
        throw new Error('You need to have a wallet connected to make a transaction');
      } else {
        // Prepare the transaction
        const prepared: Payment = await client.autofill({
          TransactionType: 'Payment',
          Account: wallets[selectedWallet].publicAddress,
          Amount: xrpToDrops(amount),
          Destination: destination
        });
        if (!prepared.Fee) {
          throw new Error("Couldn't calculate the fees, something went wrong");
        } else {
          return dropsToXrp(prepared.Fee);
        }
      }
    },
    [client, selectedWallet, wallets]
  );

  const sendPayment = useCallback(
    async ({ amount, destination }: PaymentPayload) => {
      if (!client) {
        throw new Error('You need to be connected to a ledger to make a transaction');
      } else if (!wallets?.[selectedWallet]) {
        throw new Error('You need to have a wallet connected to make a transaction');
      } else {
        // Prepare the transaction
        const prepared: Payment = await client.autofill({
          TransactionType: 'Payment',
          Account: wallets[selectedWallet].publicAddress,
          Amount: xrpToDrops(amount),
          Destination: destination
        });
        // Sign the transaction
        const signed = wallets[selectedWallet].wallet.sign(prepared);
        // Submit the signed blob
        try {
          const tx = await client.submitAndWait(signed.tx_blob);
          if ((tx.result.meta! as TransactionMetadata).TransactionResult === 'tesSUCCESS') {
            return tx.result.hash;
          } else {
            throw new Error("Something went wrong, we couldn't submit properly the transaction");
          }
        } catch (e) {
          throw e;
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
    sendPayment,
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
