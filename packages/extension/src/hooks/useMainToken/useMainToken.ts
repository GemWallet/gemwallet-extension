import { useMemo } from 'react';

import { XRP_TOKEN } from '../../constants';
import { useNetwork } from '../../contexts';

export const useMainToken = () => {
  const { networkName } = useNetwork();

  return useMemo(() => {
    switch (networkName) {
      default:
        return XRP_TOKEN;
    }
  }, [networkName]);
};
