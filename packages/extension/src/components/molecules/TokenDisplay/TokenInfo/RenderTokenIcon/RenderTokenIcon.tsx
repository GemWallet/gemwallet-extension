import { FC } from 'react';

import { Avatar } from '@mui/material';

import { useMainToken, XAH_TOKEN } from '../../../../../hooks';
import { GemWallet, LPToken, Xahau, Xrp } from '../../../../atoms';

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
  const mainToken = useMainToken();

  if (isMainToken) {
    switch (mainToken) {
      case XAH_TOKEN:
        return <Xahau />;
    }
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
