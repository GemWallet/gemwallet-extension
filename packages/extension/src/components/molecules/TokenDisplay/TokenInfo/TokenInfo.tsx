import { Ref, forwardRef } from 'react';

import { Typography } from '@mui/material';

import { RenderTokenIcon } from './RenderTokenIcon';
import { SECONDARY_GRAY } from '../../../../constants';
import { formatToken } from '../../../../utils';

export interface TokenInfoProps {
  isXRPToken: boolean;
  tokenIconUrl: string | undefined;
  token: string;
  tokenWarningMessage: string | undefined;
  balance: number;
  issuerName?: string;
}

const MAX_TOKEN_LENGTH = 5;

export const TokenInfo = forwardRef((props: TokenInfoProps, ref: Ref<HTMLDivElement>) => {
  const {
    isXRPToken,
    tokenIconUrl,
    token,
    tokenWarningMessage,
    balance,
    issuerName,
    ...otherProps
  } = props;

  const displayToken =
    token.length > MAX_TOKEN_LENGTH ? `${token.slice(0, MAX_TOKEN_LENGTH)}...` : token;

  return (
    <div ref={ref} {...otherProps} style={{ display: 'flex', alignItems: 'center' }}>
      <RenderTokenIcon {...{ isXRPToken, tokenIconUrl: tokenIconUrl || '', token }} />
      <div style={{ marginLeft: '10px' }}>
        <Typography style={tokenWarningMessage ? { color: 'brown', cursor: 'help' } : undefined}>
          {displayToken}
          {issuerName ? (
            <Typography
              component="span"
              variant="caption"
              style={{
                marginLeft: '5px',
                fontSize: 'smaller',
                fontStyle: 'italic',
                color: SECONDARY_GRAY
              }}
            >
              by {issuerName}
            </Typography>
          ) : null}
        </Typography>
        <Typography variant="body2" style={{ color: SECONDARY_GRAY }}>
          {formatToken(balance, token)}
        </Typography>
      </div>
    </div>
  );
});
