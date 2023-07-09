import { useContext, useState, useEffect, createContext, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';
import { Client } from 'xrpl';

import {
  EventNetworkChangedBackgroundMessage,
  GEM_WALLET,
  NETWORK,
  Network
} from '@gemwallet/constants';
import { NetworkData } from '@gemwallet/constants/src/network/network.types';

import { loadNetwork, removeNetwork, saveCustomNetwork, saveNetwork } from '../../utils';

interface ContextType {
  reconnectToNetwork: () => void;
  switchNetwork: (
    network: Network,
    customNetworkName?: string,
    customNetworkServer?: string
  ) => void;
  resetNetwork: () => void;
  registerCustomNetwork: (networkData: NetworkData) => void;
  // Returns null if client couldn't connect
  client?: Client | null;
  network?: Network | string;
}

const NetworkContext = createContext<ContextType>({
  reconnectToNetwork: () => {},
  switchNetwork: () => {},
  resetNetwork: () => {},
  registerCustomNetwork: () => {},
  client: undefined,
  network: undefined
});

const NetworkProvider: FC = ({ children }) => {
  const [client, setClient] = useState<Client | null>();
  const [network, setNetwork] = useState<Network | string>();

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
    async (network: Network, customNetworkName?: string, customNetworkServer?: string) => {
      try {
        await client?.disconnect();
        // If a server URL is provided, use it. Otherwise, use the pre-defined server for the given network
        const ws = new Client(customNetworkServer || NETWORK[network].server);
        await ws.connect();
        setNetwork(customNetworkName || network);
        saveNetwork(network, customNetworkName, customNetworkServer);
        setClient(ws);

        chrome.runtime
          .sendMessage<EventNetworkChangedBackgroundMessage>({
            app: GEM_WALLET,
            type: 'EVENT_NETWORK_CHANGED',
            payload: {
              id: 0,
              result: {
                network
              }
            }
          })
          .catch((e) => {
            Sentry.captureException(e);
          });
      } catch (err) {
        await client?.disconnect();
        setClient(null);
        Sentry.captureException(err);
        throw err;
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

  const registerCustomNetwork = useCallback(async (networkData: NetworkData) => {
    try {
      await saveCustomNetwork(networkData);
    } catch (err) {
      Sentry.captureException(err);
    }
  }, []);

  const value: ContextType = {
    reconnectToNetwork,
    switchNetwork,
    resetNetwork,
    registerCustomNetwork,
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
