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

import { OfflineBanner } from '../../components/atoms/OfflineBanner';
import { loadNetwork, removeNetwork, saveCustomNetwork, saveNetwork } from '../../utils';
import { connectToLedger } from '../LedgerContext/utils/connectToLedger';

const RECOGNIZED_CONNECTION_ERRORS = ['Connection failed.', 'Could not establish connection.'];
const DEFAULT_NETWORK_NAME = 'Loading...';

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
  networkName: Network | string;
  isConnectionFailed: boolean;
}

const NetworkContext = createContext<ContextType>({
  reconnectToNetwork: () => {},
  switchNetwork: () => {},
  resetNetwork: () => {},
  registerCustomNetwork: () => {},
  client: undefined,
  networkName: DEFAULT_NETWORK_NAME,
  isConnectionFailed: false
});

const NetworkProvider: FC = ({ children }) => {
  const [client, setClient] = useState<Client | null | undefined>(undefined);
  const [networkName, setNetworkName] = useState<Network | string>(DEFAULT_NETWORK_NAME);
  const [isConnectionFailed, setIsConnectionFailed] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    const connectToNetwork = async () => {
      const network = loadNetwork();
      setNetworkName(network.name);
      try {
        const ws = await connectToLedger(network.server);
        setClient(ws);
      } catch (err) {
        setClient(null);
        setIsConnectionFailed(true);
        // If connect fails, retry up to maxRetries times
        if (retryCount < maxRetries) {
          retryCount += 1;
          setTimeout(connectToNetwork, 1000);
        }
        if (!RECOGNIZED_CONNECTION_ERRORS.includes((err as Error).message)) {
          Sentry.captureException(err);
        }
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

  const reconnectToNetwork = useCallback(async () => {
    try {
      const loadedNetwork = loadNetwork();
      const ws = await connectToLedger(loadedNetwork.server);
      setNetworkName(loadedNetwork.name);
      setClient(ws);
      setIsConnectionFailed(false);
    } catch (err) {
      await client?.disconnect();
      setClient(null);
      setIsConnectionFailed(true);
      if (!RECOGNIZED_CONNECTION_ERRORS.includes((err as Error).message)) {
        Sentry.captureException(err);
      }
    }
  }, [client]);

  const switchNetwork = useCallback(
    async (network: Network, customNetworkName?: string, customNetworkServer?: string) => {
      try {
        await client?.disconnect();
        // If a server URL is provided, use it. Otherwise, use the pre-defined server for the given network
        const ws = await connectToLedger(customNetworkServer || NETWORK[network].server);
        setNetworkName(customNetworkName || network);
        saveNetwork(network, customNetworkName, customNetworkServer);
        setClient(ws);
        setIsConnectionFailed(false);

        if (process.env.NODE_ENV === 'production') {
          chrome.runtime
            .sendMessage<EventNetworkChangedBackgroundMessage>({
              app: GEM_WALLET,
              type: 'EVENT_NETWORK_CHANGED',
              source: 'GEM_WALLET_MSG_REQUEST',
              payload: {
                id: 0,
                result: {
                  network: {
                    name: NETWORK[network].name.toLowerCase(),
                    server: customNetworkServer ?? NETWORK[network].server,
                    description: NETWORK[network].description
                  }
                }
              }
            })
            .catch((e) => {
              Sentry.captureException(e);
            });
        }
      } catch (err) {
        await client?.disconnect();
        setClient(null);
        setIsConnectionFailed(true);
        if (!RECOGNIZED_CONNECTION_ERRORS.includes((err as Error).message)) {
          Sentry.captureException(err);
        }
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
      setNetworkName(network.name);
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
    networkName,
    isConnectionFailed
  };

  return (
    <NetworkContext.Provider value={value}>
      {isConnectionFailed ? <OfflineBanner reconnectToNetwork={reconnectToNetwork} /> : null}
      {children}
    </NetworkContext.Provider>
  );
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
