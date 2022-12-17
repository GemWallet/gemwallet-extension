import { FC, MouseEventHandler } from 'react';

import { Hashicon } from '@emeraldpay/hashicon-react';

import { useNetwork } from '../../../contexts';

export interface WalletIconProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  publicAddress: string;
  size?: 'md' | 'xl';
}

export const WalletIcon: FC<WalletIconProps> = ({ publicAddress, onClick, size = 'md' }) => {
  const { client } = useNetwork();

  return (
    <div
      style={{
        width: size === 'md' ? '45px' : '60px',
        height: size === 'md' ? '45px' : '60px',
        border: `solid 2px ${client ? 'green' : 'red'}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : undefined
      }}
      onClick={onClick}
    >
      <div
        style={{
          borderRadius: '50%',
          backgroundColor: 'white',
          width: size === 'md' ? '42px' : '60px',
          height: size === 'md' ? '42px' : '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Hashicon value={publicAddress} size={size === 'md' ? 35 : 50} />
      </div>
    </div>
  );
};
