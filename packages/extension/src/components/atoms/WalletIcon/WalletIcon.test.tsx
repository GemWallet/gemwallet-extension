import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WalletIcon, WalletIconProps } from './WalletIcon';
import { vi } from 'vitest';

const user = userEvent.setup();

vi.mock('@emeraldpay/hashicon-react', () => ({
  Hashicon: ({ value, size }: { value: string; size: number }) => (
    <div>
      <div>{value}</div>
      <div>{size}</div>
    </div>
  )
}));

let mockNetworkContext = {
  client: false
};
vi.mock('../../../contexts', () => ({
  useNetwork: () => mockNetworkContext
}));

const defaultPublicAddress = '0x123456789';

const renderWalletIcon = (props?: Partial<WalletIconProps>) =>
  render(
    <WalletIcon
      publicAddress={props?.publicAddress || defaultPublicAddress}
      onClick={props?.onClick || vi.fn()}
      size={props?.size}
      isConnectedInformation={props?.isConnectedInformation}
    />
  );

describe('WalletIcon', () => {
  beforeEach(() => {
    mockNetworkContext = {
      client: false
    };
  });

  test('renders the public address as a hashicon', () => {
    renderWalletIcon();
    expect(screen.getByText(defaultPublicAddress)).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  test('renders a larger icon if the size prop is set to "xl"', () => {
    renderWalletIcon({ size: 'xl' });

    expect(screen.getByText('50')).toBeInTheDocument();
  });

  test('calls the onClick prop when the icon is clicked', async () => {
    const onClick = vi.fn();
    renderWalletIcon({ onClick });
    await user.click(screen.getByRole('button', { name: 'Wallet icon' }));
    expect(onClick).toHaveBeenCalled();
  });

  test('renders a green border if the client is connected to a network', () => {
    mockNetworkContext = {
      client: true
    };
    renderWalletIcon({ isConnectedInformation: true });
    expect(screen.getByLabelText('Wallet icon with green border')).toBeInTheDocument();
  });

  test('renders a red border if the client is not connected to a network', () => {
    mockNetworkContext = {
      client: false
    };
    renderWalletIcon({ isConnectedInformation: true });
    expect(screen.getByLabelText('Wallet icon with red border')).toBeInTheDocument();
  });
});
