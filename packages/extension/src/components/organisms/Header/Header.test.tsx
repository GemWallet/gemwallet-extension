import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Chain, XRPLNetwork } from '@gemwallet/constants';

import { generateWalletContext } from '../../../mocks';
import { WalletLedger } from '../../../types';
import { Header } from './Header';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

let mockChain = Chain.XRPL;
let mockNetwork = XRPLNetwork.TESTNET;
jest.mock('../../../contexts', () => {
  return {
    useNetwork: () => ({
      networkName: mockNetwork,
      chainName: mockChain,
      switchChain: () => jest.fn()
    })
  };
});

jest.mock('../../atoms', () => ({
  WalletIcon: () => 'Mocked Wallet Icon',
  Xrp: () => 'Mocked Xrp Icon',
  Xahau: () => 'Mocked Xahau Icon'
}));
window.prompt = jest.fn();

const mockWalletContext = generateWalletContext();
const mockWalletLedger = mockWalletContext.getCurrentWallet() as WalletLedger;

describe('Header Organism', () => {
  test('Should change the copy icons after clicking the copy button', async () => {
    render(<Header wallet={mockWalletLedger} />);
    const user = userEvent.setup();

    const contentCopyIcon = screen.getByTestId('ContentCopyIcon');
    expect(contentCopyIcon).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    await user.click(copyButton);

    const doneIcon = screen.getByTestId('DoneIcon');
    expect(doneIcon).toBeInTheDocument();
  });
});
