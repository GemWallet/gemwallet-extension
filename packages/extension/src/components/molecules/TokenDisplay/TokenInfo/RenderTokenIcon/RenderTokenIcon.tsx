import { FC } from 'react';

import { Avatar } from '@mui/material';

import { GemWallet, LPToken, Xrp } from '../../../../atoms';

interface RenderTokenIconProps {
  isXRPToken?: boolean;
  tokenIconUrl: string;
  token: string;
  isLPToken?: boolean;
}

export const RenderTokenIcon: FC<RenderTokenIconProps> = ({
  isXRPToken,
  tokenIconUrl,
  token,
  isLPToken
}) => {
  if (isXRPToken) {
    return <Xrp />;
  }

  if (isLPToken) {
    return <LPToken />;
  }

  if (tokenIconUrl) {
    return <Avatar src={tokenIconUrl} alt={token} style={{ width: '45px', height: '45px' }} />;
  }

  return <GemWallet />;
};
