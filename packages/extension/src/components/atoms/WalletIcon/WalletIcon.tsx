import { FC } from 'react';
import { Hashicon } from '@emeraldpay/hashicon-react';
import { useLedger } from '../../../contexts/LedgerContext';

export interface WalletIconProps {
  publicAddress: string;
}

export const WalletIcon: FC<WalletIconProps> = ({ publicAddress }) => {
  const { client } = useLedger();

  return (
    <div
      style={{
        width: '45px',
        height: '45px',
        border: `solid 2px ${client ? 'green' : 'red'}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
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
