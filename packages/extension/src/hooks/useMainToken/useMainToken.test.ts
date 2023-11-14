import { renderHook } from '@testing-library/react-hooks';

import { Chain } from '@gemwallet/constants';

import { XAH_TOKEN, XRP_TOKEN } from '../../constants';
import { useNetwork } from '../../contexts';
import { useMainToken } from './useMainToken';

jest.mock('../../contexts', () => ({
  useNetwork: jest.fn()
}));

describe('useMainToken', () => {
  it('returns XRP_TOKEN for default network', () => {
    useNetwork.mockReturnValue({ chainName: 'SomeChain' });
    const { result } = renderHook(() => useMainToken());
    expect(result.current).toBe(XRP_TOKEN);
  });

  it('returns XAH_TOKEN for XAHAU_TESTNET', () => {
    useNetwork.mockReturnValue({ chainName: Chain.XAHAU });
    const { result } = renderHook(() => useMainToken());
    expect(result.current).toBe(XAH_TOKEN);
  });
});
