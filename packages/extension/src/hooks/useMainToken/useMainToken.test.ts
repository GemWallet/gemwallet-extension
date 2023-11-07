import { renderHook } from '@testing-library/react-hooks';

import { XRP_TOKEN } from '../../constants';
import { useNetwork } from '../../contexts';
import { useMainToken } from './useMainToken';

jest.mock('../../contexts', () => ({
  useNetwork: jest.fn()
}));

describe('useMainToken', () => {
  it('returns XRP_TOKEN for default network', () => {
    useNetwork.mockReturnValue({ networkName: 'SomeNetwork' });
    const { result } = renderHook(() => useMainToken());
    expect(result.current).toBe(XRP_TOKEN);
  });
});
