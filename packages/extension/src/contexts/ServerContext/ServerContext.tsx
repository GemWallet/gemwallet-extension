import { useMemo, useState, useEffect, createContext, FC } from 'react';

import * as Sentry from '@sentry/react';
import { ServerInfoResponse } from 'xrpl';

import { useNetwork } from '../NetworkContext';

type ServerInfo = ServerInfoResponse['result'];

export interface ServerContextType {
  // Returns null if serverInfo couldn't be fetched
  serverInfo?: ServerInfo | null;
}

interface Props {
  children: React.ReactElement;
}

export const ServerContext = createContext<ServerContextType>({
  serverInfo: undefined
});

export const ServerProvider: FC<Props> = ({ children }) => {
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

  const value: ServerContextType = useMemo(() => {
    return {
      serverInfo
    };
  }, [serverInfo]);

  return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
};
