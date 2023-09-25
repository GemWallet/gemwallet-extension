import { FC } from 'react';

import { Avatar } from '@mui/material';

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
    return <Avatar src={tokenIconUrl} alt={token} style={{ width: '45px', height: '45px' }} />;
  }

  return <GemWallet />;
};
