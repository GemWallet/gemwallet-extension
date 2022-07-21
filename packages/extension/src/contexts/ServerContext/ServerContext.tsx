import { useContext, useState, useEffect, createContext, FC } from 'react';
import { ServerInfoResponse } from 'xrpl';
import { useLedger } from '../LedgerContext';

type ServerInfo = ServerInfoResponse['result'];

interface ContextType {
  serverInfo?: ServerInfo;
}

const ServerContext = createContext<ContextType>({
  serverInfo: undefined
});

const ServerProvider: FC = ({ children }) => {
  const { client } = useLedger();

  const [serverInfo, setServerInfo] = useState<ServerInfo | undefined>();

  useEffect(() => {
    client
      ?.request({
        command: 'server_info'
      })
      .then(({ result }) => {
        setServerInfo(result);
      })
      .catch((e) => {
        throw e;
      });
  }, [client]);

  const value: ContextType = {
    serverInfo
  };

  return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
};

const useServer = (): ContextType => {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};

export { ServerProvider, ServerContext, useServer };
