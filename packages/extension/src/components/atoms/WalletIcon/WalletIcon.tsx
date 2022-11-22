import { FC, MouseEventHandler } from 'react';

import { Hashicon } from '@emeraldpay/hashicon-react';

import { useNetwork } from '../../../contexts';

export interface WalletIconProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  publicAddress: string;
}

export const WalletIcon: FC<WalletIconProps> = ({ publicAddress, onClick }) => {
  const { client } = useNetwork();

  return (
    <div
      style={{
        width: '45px',
        height: '45px',
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
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Hashicon value={publicAddress} size={35} />
      </div>
    </div>
  );
};
