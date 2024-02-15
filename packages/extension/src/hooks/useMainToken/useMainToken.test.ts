import { renderHook } from '@testing-library/react-hooks';

import { Chain } from '@gemwallet/constants';

import { XAH_TOKEN, XRP_TOKEN } from '../../constants';
import { useMainToken } from './useMainToken';
import { vi, describe, it } from 'vitest';
import * as contexts from '../../contexts';

vi.mock('../../contexts', () => ({
  useNetwork: vi.fn()
}));

describe('useMainToken', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns XRP_TOKEN for default network', () => {
    vi.mocked(contexts.useNetwork).mockReturnValue({ chainName: 'SomeChain' } as any);

    const { result } = renderHook(() => useMainToken());
    expect(result.current).toBe(XRP_TOKEN);
  });

  it('returns XAH_TOKEN for XAHAU_TESTNET', () => {
    vi.mocked(contexts.useNetwork).mockReturnValue({ chainName: Chain.XAHAU } as any);

    const { result } = renderHook(() => useMainToken());
    expect(result.current).toBe(XAH_TOKEN);
  });
});
