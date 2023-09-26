import { Ref, forwardRef } from 'react';

import { Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../../constants';
import { formatToken } from '../../../../utils';
import { RenderTokenIcon } from './RenderTokenIcon';

export interface TokenInfoProps {
  isXRPToken: boolean;
  tokenIconUrl: string | undefined;
  token: string;
  tokenWarningMessage: string | undefined;
  balance: number;
}

export const TokenInfo = forwardRef((props: TokenInfoProps, ref: Ref<HTMLDivElement>) => {
  const { isXRPToken, tokenIconUrl, token, tokenWarningMessage, balance, ...otherProps } = props;

  return (
    <div ref={ref} {...otherProps} style={{ display: 'flex', alignItems: 'center' }}>
      <RenderTokenIcon {...{ isXRPToken, tokenIconUrl: tokenIconUrl || '', token }} />
      <div style={{ marginLeft: '10px' }}>
        <Typography style={tokenWarningMessage ? { color: 'brown', cursor: 'help' } : undefined}>
          {token}
        </Typography>
        <Typography variant="body2" style={{ color: SECONDARY_GRAY }}>
          {formatToken(balance, token)}
        </Typography>
      </div>
    </div>
  );
});
