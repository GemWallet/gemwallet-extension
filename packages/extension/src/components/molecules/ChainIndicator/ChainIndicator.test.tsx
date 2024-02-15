import { render, screen } from '@testing-library/react';

import { Chain } from '@gemwallet/constants';

import { ChainIndicator } from './ChainIndicator';
import { vi } from 'vitest';

const mockUseNetwork = vi.fn();

vi.mock('../../../contexts', () => {
  return {
    useNetwork: () => mockUseNetwork()
  };
});

describe('ChainIndicator', () => {
  test('renders the XRPL chain', () => {
    mockUseNetwork.mockReturnValue({
      chainName: Chain.XRPL,
      switchChain: vi.fn()
    });

    render(<ChainIndicator />);

    expect(screen.getAllByTestId('xrp-icon')).toHaveLength(2);
    expect(screen.getAllByTestId('xahau-icon')).toHaveLength(1);
  });

  test('renders the XAHAU chain', () => {
    mockUseNetwork.mockReturnValue({
      chainName: Chain.XAHAU,
      switchChain: vi.fn()
    });

    render(<ChainIndicator />);

    expect(screen.getAllByTestId('xahau-icon')).toHaveLength(2);
    expect(screen.getAllByTestId('xrp-icon')).toHaveLength(1);
  });
});
