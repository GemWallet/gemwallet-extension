import { useContext, useState, useEffect, createContext, FC, useCallback } from 'react';
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
  const [client, setClient] = useState<Client | undefined>();
  const [network, setNetwork] = useState<Network>();

  const connectToNetwork = async () => {
    const network = await loadNetwork();
    const client = new Client(network.server);
    await client.connect();
    setClient(client);
    setNetwork(network.name);
  };

  useEffect(() => {
    // Connect to testnet network
    connectToNetwork();
  }, []);

  useEffect(() => {
    // Disconnect the websocket
    return () => {
      client?.disconnect();
    };
  }, [client]);

  const switchNetwork = useCallback(
    async (network: Network) => {
      await client?.disconnect();
      const newClient = new Client(NETWORK[network].server);
      await newClient.connect();
      setClient(newClient);
      setNetwork(network);
      saveNetwork(network);
    },
    [client]
  );

  const resetNetwork = useCallback(async () => {
    await removeNetwork();
    const network = await loadNetwork();
    setNetwork(network.name);
  }, []);

  const value: ContextType = {
    switchNetwork,
    resetNetwork,
    client,
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
