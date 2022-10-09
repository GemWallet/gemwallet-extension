import { useContext, useState, useEffect, createContext, FC, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { Client } from 'xrpl';
import { Network } from '../../types';
import { loadNetwork, saveNetwork } from '../../utils';
import { NETWORK } from '../../constants';

interface ContextType {
  switchNetwork: (network: Network) => void;
  client?: Client;
  network?: Network;
}

const NetworkContext = createContext<ContextType>({
  switchNetwork: () => {},
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

  const value: ContextType = {
    switchNetwork,
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
