import { useContext, useState, useEffect, createContext, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';
import { Client } from 'xrpl';

import { NETWORK, Network } from '@gemwallet/constants';

import { loadNetwork, removeNetwork, saveNetwork } from '../../utils';

interface ContextType {
  reconnectToNetwork: () => void;
  switchNetwork: (network: Network, serverURL?: string) => void;
  resetNetwork: () => void;
  // Returns null if client couldn't connect
  client?: Client | null;
  network?: Network;
}

const NetworkContext = createContext<ContextType>({
  reconnectToNetwork: () => {},
  switchNetwork: () => {},
  resetNetwork: () => {},
  client: undefined,
  network: undefined
});

const NetworkProvider: FC = ({ children }) => {
  const [client, setClient] = useState<Client | null>();
  const [network, setNetwork] = useState<Network>();

  useEffect(() => {
    const connectToNetwork = async () => {
      const network = loadNetwork();
      const ws = new Client(network.server);
      try {
        await ws.connect();
        setNetwork(network.name);
        setClient(ws);
      } catch (err) {
        await ws?.disconnect();
        setClient(null);
        Sentry.captureException(err);
      }
    };

    connectToNetwork();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Close the WebSocket connection if it is open
      if (client) {
        client?.disconnect();
      }
    };
    // Add event listener for beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [client]);

  const reconnectToNetwork = async () => {
    try {
      const loadedNetwork = loadNetwork();
      const ws = new Client(network || loadedNetwork.server);
      await ws.connect();
      setNetwork(network || loadedNetwork.name);
      setClient(ws);
    } catch (err) {
      await client?.disconnect();
      setClient(null);
      Sentry.captureException(err);
    }
  };

  const switchNetwork = useCallback(
    async (network: Network, serverURL?: string) => {
      try {
        await client?.disconnect();
        // If a server URL is provided, use it. Otherwise, use the pre-defined server for the given network
        const ws = new Client(serverURL || NETWORK[network].server);
        await ws.connect();
        setNetwork(network);
        saveNetwork(network);
        setClient(ws);
      } catch (err) {
        await client?.disconnect();
        setClient(null);
        Sentry.captureException(err);
      }
    },
    [client]
  );

  // Remove Network configuration and set default one
  const resetNetwork = useCallback(async () => {
    try {
      await removeNetwork();
      const network = await loadNetwork();
      setNetwork(network.name);
    } catch (err) {
      Sentry.captureException(err);
    }
  }, []);

  const value: ContextType = {
    reconnectToNetwork,
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
