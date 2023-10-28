import { renderHook } from '@testing-library/react-hooks';

import { Network } from '@gemwallet/constants';

import { useNetwork } from '../../contexts';
import { useMainToken, XRP_TOKEN, XAH_TOKEN } from './useMainToken';

jest.mock('../../contexts', () => ({
  useNetwork: jest.fn()
}));

describe('useMainToken', () => {
  it('returns XRP_TOKEN for default network', () => {
    useNetwork.mockReturnValue({ networkName: 'SomeNetwork' });
    const { result } = renderHook(() => useMainToken());
    expect(result.current).toBe(XRP_TOKEN);
  });

  it('returns XAH_TOKEN for XAHAU_TESTNET', () => {
    useNetwork.mockReturnValue({ networkName: Network.XAHAU_TESTNET });
    const { result } = renderHook(() => useMainToken());
    expect(result.current).toBe(XAH_TOKEN);
  });
});
