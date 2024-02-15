import { useContext, useMemo, useState, useEffect, createContext, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';
import { useLocation } from 'react-router-dom';
import { Client } from 'xrpl';

import {
  Chain,
  EventNetworkChangedBackgroundMessage,
  GEM_WALLET,
  getDefaultNetwork,
  getNetwork,
  Network
} from '@gemwallet/constants';

import { OfflineBanner } from '../../components/atoms/OfflineBanner';
import { hideOfflineBannerRoutes } from '../../components/pages/routes';
import { loadNetwork, removeNetwork, saveNetwork } from '../../utils';
import { connectToLedger } from '../LedgerContext/utils/connectToLedger';

const RECOGNIZED_CONNECTION_ERRORS = ['Connection failed.', 'Could not establish connection.'];
const DEFAULT_NETWORK_NAME = 'Loading...';

interface ContextType {
  reconnectToNetwork: () => Promise<void>;
  switchNetwork: (params: {
    network: Network;
    chain?: Chain;
    customNetworkName?: string;
    customNetworkServer?: string;
  }) => Promise<void>;
  resetNetwork: () => Promise<void>;
  switchChain: (chain: Chain) => Promise<void>;
  // Returns null if client couldn't connect
  client?: Client | null;
  networkName: Network | string;
  chainName: Chain;
  isConnectionFailed: boolean;
  hasOfflineBanner: boolean;
}

interface Props {
  children: React.ReactElement;
}

const NetworkContext = createContext<ContextType>({
  reconnectToNetwork: () => new Promise(() => {}),
  switchNetwork: () => new Promise(() => {}),
  resetNetwork: () => new Promise(() => {}),
  switchChain: () => new Promise(() => {}),
  client: undefined,
  networkName: DEFAULT_NETWORK_NAME,
  chainName: Chain.XRPL,
  isConnectionFailed: false,
  hasOfflineBanner: false
});

const MAX_RETRIES = 2;

const NetworkProvider: FC<Props> = ({ children }) => {
  const { pathname } = useLocation();

  const [client, setClient] = useState<Client | null | undefined>(undefined);
  const [networkName, setNetworkName] = useState<Network | string>(DEFAULT_NETWORK_NAME);
  const [chainName, setChainName] = useState<Chain>(Chain.XRPL);
  const [isConnectionFailed, setIsConnectionFailed] = useState(false);
  const [hasOfflineBanner, setHasOfflineBanner] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    let nodeIndex = 0;

    const connectToNetwork = async () => {
      const network = loadNetwork();
      setNetworkName(network.customNetworkName ?? network.name);
      if (chainName !== network.chain) {
        setChainName(network.chain);
      }
      let node = network.server;
      if (nodeIndex !== 0 && network.nodes?.[nodeIndex]) {
        node = network.nodes[nodeIndex];
      }
      try {
        const ws = await connectToLedger(node);
        setIsConnectionFailed(false);
        setClient(ws);
      } catch (err) {
        setClient(null);
        setIsConnectionFailed(true);
        // If connection fails, change the node, up to MAX_RETRIES times
        if (network.nodes && nodeIndex <= network.nodes.length) {
          nodeIndex += 1;
          setTimeout(connectToNetwork, 1000);
        } else if (retryCount < MAX_RETRIES) {
          retryCount += 1;
          nodeIndex = 0;
          setTimeout(connectToNetwork, 1000);
        }
        if (
          retryCount > MAX_RETRIES &&
          !RECOGNIZED_CONNECTION_ERRORS.includes((err as Error).message)
        ) {
          Sentry.captureException(err);
        }
      }
    };

    connectToNetwork();
  }, [chainName]);

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

  useEffect(() => {
    if (isConnectionFailed && !hideOfflineBannerRoutes.includes(pathname)) {
      setHasOfflineBanner(true);
    } else {
      setHasOfflineBanner(false);
    }
  }, [isConnectionFailed, pathname]);

  const reconnectToNetwork = useCallback(async () => {
    try {
      const loadedNetwork = loadNetwork();
      const ws = await connectToLedger(loadedNetwork.server);
      setNetworkName(loadedNetwork.customNetworkName ?? loadedNetwork.name);
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
    async (params: {
      network: Network;
      chain?: Chain;
      customNetworkName?: string;
      customNetworkServer?: string;
    }) => {
      const { network, chain, customNetworkName, customNetworkServer } = params;

      try {
        await client?.disconnect();
        // If a server URL is provided, use it. Otherwise, use the pre-defined server for the given network
        const ws = await connectToLedger(
          customNetworkServer || getNetwork(chain ?? chainName, network).server
        );
        setNetworkName(customNetworkName || network);
        if (chain) setChainName(chain);
        saveNetwork(chain ?? chainName, network, customNetworkName, customNetworkServer);
        setClient(ws);
        setIsConnectionFailed(false);

        if (process.env.NODE_ENV === 'production') {
          const currentNetwork = getNetwork(chain ?? chainName, network);
          chrome.runtime
            .sendMessage<EventNetworkChangedBackgroundMessage>({
              app: GEM_WALLET,
              type: 'EVENT_NETWORK_CHANGED',
              source: 'GEM_WALLET_MSG_REQUEST',
              payload: {
                id: 0,
                result: {
                  network: {
                    name: currentNetwork.name.toLowerCase(),
                    server: customNetworkServer ?? currentNetwork.server,
                    description: currentNetwork.description
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
    [chainName, client]
  );

  const switchChain = useCallback(
    async (chain: Chain) => {
      const newNetwork = getDefaultNetwork(chain);
      await switchNetwork({ network: newNetwork, chain });
    },
    [switchNetwork]
  );

  // Remove Network configuration and set default one
  const resetNetwork = useCallback(async () => {
    try {
      await removeNetwork();
      const network = await loadNetwork();
      setNetworkName(network.customNetworkName ?? network.name);
    } catch (err) {
      Sentry.captureException(err);
    }
  }, []);

  const value: ContextType = useMemo(() => {
    return {
      reconnectToNetwork,
      switchNetwork,
      resetNetwork,
      client,
      networkName,
      chainName,
      isConnectionFailed,
      hasOfflineBanner,
      switchChain
    };
  }, [
    reconnectToNetwork,
    switchNetwork,
    resetNetwork,
    client,
    networkName,
    chainName,
    isConnectionFailed,
    hasOfflineBanner,
    switchChain
  ]);

  return (
    <NetworkContext.Provider value={value}>
      {hasOfflineBanner ? <OfflineBanner reconnectToNetwork={reconnectToNetwork} /> : null}
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
