import { FC } from 'react';

import { Avatar } from '@mui/material';

import { GemWallet, LPToken, Xrp } from '../../../../atoms';

interface RenderTokenIconProps {
  isMainToken?: boolean;
  tokenIconUrl: string;
  token: string;
  isLPToken?: boolean;
}

export const RenderTokenIcon: FC<RenderTokenIconProps> = ({
  isMainToken,
  tokenIconUrl,
  token,
  isLPToken
}) => {
  if (isMainToken) {
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
