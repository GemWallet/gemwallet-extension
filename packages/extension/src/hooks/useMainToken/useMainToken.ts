import { useMemo } from 'react';

import { XRP_TOKEN } from '../../constants';
import { useNetwork } from '../../contexts';

export const useMainToken = () => {
  const { chainName } = useNetwork();

  return useMemo(() => {
    switch (chainName) {
      default:
        return XRP_TOKEN;
    }
  }, [chainName]);
};
