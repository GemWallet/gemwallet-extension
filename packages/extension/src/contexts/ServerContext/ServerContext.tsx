import { useContext, useMemo, useState, useEffect, createContext, FC } from 'react';

import * as Sentry from '@sentry/react';
import { ServerInfoResponse } from 'xrpl';

import { useNetwork } from '../NetworkContext';

type ServerInfo = ServerInfoResponse['result'];

interface ContextType {
  // Returns null if serverInfo couldn't be fetched
  serverInfo?: ServerInfo | null;
}

interface Props {
  children: React.ReactElement;
}

const ServerContext = createContext<ContextType>({
  serverInfo: undefined
});

const ServerProvider: FC<Props> = ({ children }) => {
  const { client } = useNetwork();

  const [serverInfo, setServerInfo] = useState<ServerInfo | null>();

  useEffect(() => {
    client
      ?.request({
        command: 'server_info'
      })
      .then(({ result }) => {
        setServerInfo(result);
      })
      .catch((e) => {
        setServerInfo(null);
        Sentry.captureException(e);
      });
  }, [client]);

  const value: ContextType = useMemo(() => {
    return {
      serverInfo
    };
  }, [serverInfo]);

  return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
};

const useServer = (): ContextType => {
  const context = useContext(ServerContext);
  if (context === undefined) {
    const error = new Error('useServer must be used within a ServerProvider');
    Sentry.captureException(error);
  }
  return context;
};

export { ServerProvider, ServerContext, useServer };
