import { useMemo } from 'react';

import { Chain } from '@gemwallet/constants';

import { XAH_TOKEN, XRP_TOKEN } from '../../constants';
import { useNetwork } from '../../contexts';

export const useMainToken = () => {
  const { chainName } = useNetwork();

  return useMemo(() => {
    switch (chainName) {
      case Chain.Xahau:
        return XAH_TOKEN;
      default:
        return XRP_TOKEN;
    }
  }, [chainName]);
};
