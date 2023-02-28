import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';
import { Client } from 'xrpl';

import { Network, NetworkInfo } from '@gemwallet/constants';

import { loadNetwork, removeNetwork, saveNetwork } from '../../utils';

interface ContextType {
  connectToNetwork: (network?: Network) => void;
  resetNetwork: () => void;
  // Returns null if client couldn't connect
  client?: Client | null;
  network?: Network;
  isDisconnected: Boolean;
}

const NetworkContext = createContext<ContextType>({
  connectToNetwork: () => {},
  resetNetwork: () => {},
  client: undefined,
  network: undefined,
  isDisconnected: true
});

const NetworkProvider: FC = ({ children }) => {
  const [client, setClient] = useState<Client | null>();
  const [network, setNetwork] = useState<Network>();
  const [isDisconnected, setIsDisconnected] = useState<Boolean>(false);

  const disconnect = useCallback(async () => {
    if (client && client.isConnected()) {
      await client.disconnect();
    }
    setClient(null);
    setIsDisconnected(true);
  }, []);

  const connect = useCallback(async (loadedNetwork: NetworkInfo) => {
    const ws = new Client(loadedNetwork.server);
    await ws.connect();
    setNetwork(loadedNetwork.name);
    setClient(ws);
    client?.on('disconnected', () => {
      setIsDisconnected(true);
    });
    client?.on('connected', () => {
      setIsDisconnected(false);
    });
    setIsDisconnected(false);
  }, []);

  const connectToNetwork = useCallback(
    async (network?: Network) => {
      try {
        await disconnect();
        const loadedNetwork = loadNetwork(network);
        await connect(loadedNetwork);
        if (network) saveNetwork(network);
      } catch (err) {
        await disconnect();
        Sentry.captureException(err);
      }
    },
    [disconnect, connect]
  );

  // Remove Network configuration and set default one
  const resetNetwork = useCallback(async () => {
    try {
      await removeNetwork();
      await connectToNetwork();
    } catch (err) {
      await disconnect();
      Sentry.captureException(err);
    }
  }, [connectToNetwork, disconnect]);

  useEffect(() => {
    // open ws connection at startup
    connectToNetwork();
    // Make sure the WebSocket connection is disconnected before the extension is closed
    window.addEventListener('beforeunload', disconnect, { once: true });
  }, [connectToNetwork]);

  const value: ContextType = {
    connectToNetwork,
    resetNetwork,
    client,
    network,
    isDisconnected
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
