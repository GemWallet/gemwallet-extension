import { render, screen } from '@testing-library/react';

import { Chain } from '@gemwallet/constants';

import { ChainIndicator } from './ChainIndicator';

const mockUseNetwork = jest.fn();

jest.mock('../../../contexts', () => {
  return {
    useNetwork: () => mockUseNetwork()
  };
});

describe('ChainIndicator', () => {
  test('renders the XRPL chain', () => {
    mockUseNetwork.mockReturnValue({
      chainName: Chain.XRPL,
      switchChain: jest.fn()
    });

    render(<ChainIndicator />);

    expect(screen.getAllByTestId('xrp-icon')).toHaveLength(2);
    expect(screen.getAllByTestId('xahau-icon')).toHaveLength(1);
  });

  test('renders the XAHAU chain', () => {
    mockUseNetwork.mockReturnValue({
      chainName: Chain.XAHAU,
      switchChain: jest.fn()
    });

    render(<ChainIndicator />);

    expect(screen.getAllByTestId('xahau-icon')).toHaveLength(2);
    expect(screen.getAllByTestId('xrp-icon')).toHaveLength(1);
  });
});
