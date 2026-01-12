import { FC, ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure QueryClient with sensible defaults for a wallet extension
// - staleTime: 30 seconds - data is fresh for 30s, no refetch needed
// - gcTime: 5 minutes - cached data kept for 5min after component unmounts
// - refetchOnWindowFocus: false - don't refetch when popup regains focus
// - retry: 1 - retry failed requests once
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes (garbage collection time)
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnMount: false // Don't refetch if data is still fresh
    }
  }
});

interface Props {
  children: ReactNode;
}

export const QueryProvider: FC<Props> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export { queryClient };
