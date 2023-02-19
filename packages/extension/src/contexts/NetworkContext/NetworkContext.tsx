import { useContext, useState, useEffect, createContext, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';
import { Client } from 'xrpl';

import { NETWORK, Network } from '@gemwallet/constants';

import { loadNetwork, removeNetwork, saveNetwork } from '../../utils';

interface ContextType {
  connectToNetwork: () => void;
  switchNetwork: (network: Network) => void;
  resetNetwork: () => void;
  // Returns null if client couldn't connect
  client?: Client | null;
  network?: Network;
  isDisconnected: Boolean;
}

const NetworkContext = createContext<ContextType>({
  connectToNetwork: () => {},
  switchNetwork: () => {},
  resetNetwork: () => {},
  client: undefined,
  network: undefined,
  isDisconnected: true
});

const NetworkProvider: FC = ({ children }) => {
  const [client, setClient] = useState<Client | null>();
  const [network, setNetwork] = useState<Network>();
  const [isDisconnected, setIsDisconnected] = useState<Boolean>(false);

  useEffect(() => {
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

  async function disconnect() {
    if (client && client.isConnected()) {
      await client.disconnect();
      setClient(null);
      setIsDisconnected(true);
    }
  }

  async function connect(loadedNetwork: { name: Network; server: string; description: string }) {
    const ws = new Client(network || loadedNetwork.server);
    await ws.connect();
    setNetwork(loadedNetwork.name);
    setClient(ws);
    client?.on('disconnected', () => {
      console.log('DISCONNECTED');
      setIsDisconnected(true);
    });
    client?.on('connected', () => {
      console.log('CONNECTED');
      setIsDisconnected(false);
    });
    setIsDisconnected(false);
  }

  const connectToNetwork = async () => {
    try {
      await disconnect();
      const loadedNetwork = loadNetwork();
      await connect(loadedNetwork);
    } catch (err) {
      await disconnect();
      Sentry.captureException(err);
    }
  };

  const switchNetwork = useCallback(
    async (network: Network) => {
      try {
        await disconnect();
        const loadedNetwork = NETWORK[network];
        await connect(loadedNetwork);
        saveNetwork(network);
      } catch (err) {
        await disconnect();
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
    connectToNetwork,
    switchNetwork,
    resetNetwork,
    client,
    network,
    isDisconnected
  };

  console.log('isDisconnected ' + isDisconnected);

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
