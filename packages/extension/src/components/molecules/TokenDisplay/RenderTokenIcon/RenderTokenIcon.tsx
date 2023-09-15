import { FC } from 'react';

import { GemWallet, Xrp } from '../../../atoms';

interface RenderTokenIconProps {
  isXRPToken?: boolean;
  tokenIconUrl: string;
  token: string;
}

export const RenderTokenIcon: FC<RenderTokenIconProps> = ({ isXRPToken, tokenIconUrl, token }) => {
  if (isXRPToken) {
    return <Xrp />;
  }

  if (tokenIconUrl) {
    return (
      <img
        src={tokenIconUrl}
        alt={token}
        style={{ width: '45px', height: '45px', marginRight: '10px' }}
      />
    );
  }

  return <GemWallet />;
};
