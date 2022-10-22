import { useContext, useState, useEffect, createContext, FC, useCallback, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { NETWORK, Network } from '@gemwallet/constants';
import { Client } from 'xrpl';
import { loadNetwork, removeNetwork, saveNetwork } from '../../utils';

interface ContextType {
  switchNetwork: (network: Network) => void;
  resetNetwork: () => void;
  client?: Client;
  network?: Network;
}

const NetworkContext = createContext<ContextType>({
  switchNetwork: () => {},
  resetNetwork: () => {},
  client: undefined,
  network: undefined
});

const NetworkProvider: FC = ({ children }) => {
  const clientRef = useRef<Client | undefined>();
  const [network, setNetwork] = useState<Network>();

  useEffect(() => {
    const connectToNetwork = async () => {
      const network = await loadNetwork();
      clientRef.current = new Client(network.server);
      await clientRef.current.connect();
      setNetwork(network.name);
    };

    connectToNetwork();

    return () => {
      clientRef.current?.disconnect();
    };
  }, []);

  const switchNetwork = useCallback(async (network: Network) => {
    console.log('client - before: ', clientRef.current);
    await clientRef.current?.disconnect();
    clientRef.current = new Client(NETWORK[network].server);
    await clientRef.current.connect();
    setNetwork(network);
    saveNetwork(network);
  }, []);

  const resetNetwork = useCallback(async () => {
    await removeNetwork();
    const network = await loadNetwork();
    setNetwork(network.name);
  }, []);

  const value: ContextType = {
    switchNetwork,
    resetNetwork,
    client: clientRef.current,
    network
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};

const useNetwork = (): ContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    const error = new Error('useNetwork must be used within a NetworkProvider');
    Sentry.captureException(error);
    throw error;
  }
  return context;
};

export { NetworkProvider, NetworkContext, useNetwork };
