import { renderHook } from '@testing-library/react';

import { Chain } from '@gemwallet/constants';

import { XAH_TOKEN, XRP_TOKEN } from '../../constants';
import { useMainToken } from './useMainToken';
import { vi, describe, it } from 'vitest';
import * as contexts from '../../contexts';

vi.mock('../../contexts', () => ({
  useNetwork: vi.fn()
}));

describe('useMainToken', () => {
  it('returns XRP_TOKEN for default network', () => {
    vi.mocked(contexts.useNetwork).mockReturnValue({
      chainName: Chain.XRPL,
      reconnectToNetwork: vi.fn(),
      switchNetwork: vi.fn(),
      resetNetwork: vi.fn(),
      switchChain: vi.fn(),
      networkName: 'XRPL',
      isConnectionFailed: false,
      hasOfflineBanner: false
    });

    const { result } = renderHook(() => useMainToken());
    expect(result.current).toBe(XRP_TOKEN);
  });

  it('returns XAH_TOKEN for XAHAU_TESTNET', () => {
    vi.mocked(contexts.useNetwork).mockReturnValue({
      chainName: Chain.XAHAU,
      reconnectToNetwork: vi.fn(),
      switchNetwork: vi.fn(),
      resetNetwork: vi.fn(),
      switchChain: vi.fn(),
      networkName: 'Xahau',
      isConnectionFailed: false,
      hasOfflineBanner: false
    });

    const { result } = renderHook(() => useMainToken());
    expect(result.current).toBe(XAH_TOKEN);
  });
});
