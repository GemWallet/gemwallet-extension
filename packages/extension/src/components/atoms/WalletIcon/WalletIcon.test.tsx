import { fireEvent, render, screen } from '@testing-library/react';

import { WalletIcon, WalletIconProps } from './WalletIcon';

jest.mock('@emeraldpay/hashicon-react', () => ({
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
jest.mock('../../../contexts', () => ({
  useNetwork: () => mockNetworkContext
}));

const defaultPublicAddress = '0x123456789';

const renderWalletIcon = (props?: Partial<WalletIconProps>) =>
  render(
    <WalletIcon
      publicAddress={props?.publicAddress || defaultPublicAddress}
      onClick={props?.onClick || jest.fn()}
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

  it('renders the public address as a hashicon', () => {
    renderWalletIcon();
    expect(screen.getByText(defaultPublicAddress)).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('renders a larger icon if the size prop is set to "xl"', () => {
    renderWalletIcon({ size: 'xl' });

    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('calls the onClick prop when the icon is clicked', () => {
    const onClick = jest.fn();
    renderWalletIcon({ onClick });
    fireEvent.click(screen.getByRole('button', { name: 'Wallet icon' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('renders a green border if the client is connected to a network', () => {
    mockNetworkContext = {
      client: true
    };
    renderWalletIcon({ isConnectedInformation: true });
    expect(screen.getByLabelText('Wallet icon with green border')).toBeInTheDocument();
  });

  it('renders a red border if the client is not connected to a network', () => {
    mockNetworkContext = {
      client: false
    };
    renderWalletIcon({ isConnectedInformation: true });
    expect(screen.getByLabelText('Wallet icon with red border')).toBeInTheDocument();
  });
});
