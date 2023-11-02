import { Ref, forwardRef, useMemo } from 'react';

import { Tooltip, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../../constants';
import { formatToken } from '../../../../utils';
import { LP_TOKEN_NAME } from '../../../../utils/trustlines';
import { RenderTokenIcon } from './RenderTokenIcon';

export interface TokenInfoProps {
  isXRPToken: boolean;
  tokenIconUrl: string | undefined;
  token: string;
  tokenWarningMessage: string | undefined;
  balance: number;
  issuerName?: string;
  issuerAddress?: string;
}

const MAX_TOKEN_LENGTH = 5;
const MAX_ISSUER_LENGTH = 20;

export const TokenInfo = forwardRef((props: TokenInfoProps, ref: Ref<HTMLDivElement>) => {
  const {
    isXRPToken,
    tokenIconUrl,
    token,
    tokenWarningMessage,
    balance,
    issuerName,
    issuerAddress,
    ...otherProps
  } = props;

  const isLPToken = useMemo(() => {
    return token === LP_TOKEN_NAME;
  }, [token]);

  const displayToken = useMemo(() => {
    return token.length > MAX_TOKEN_LENGTH && !isLPToken
      ? `${token.slice(0, MAX_TOKEN_LENGTH)}...`
      : token;
  }, [token, isLPToken]);

  const formattedIssuerAddress = useMemo(() => {
    return issuerAddress && issuerAddress.length > MAX_ISSUER_LENGTH
      ? `${issuerAddress.slice(0, MAX_ISSUER_LENGTH)}...`
      : issuerAddress;
  }, [issuerAddress]);

  return (
    <div ref={ref} {...otherProps} style={{ display: 'flex', alignItems: 'center' }}>
      <RenderTokenIcon {...{ isXRPToken, tokenIconUrl: tokenIconUrl || '', token, isLPToken }} />
      <div style={{ marginLeft: '10px' }}>
        <Typography
          style={tokenWarningMessage && !isLPToken ? { color: 'brown', cursor: 'help' } : undefined}
        >
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
          {isLPToken ? (
            <Tooltip
              title={issuerAddress || ''}
              placement="top"
              arrow
              disableHoverListener={
                issuerAddress !== undefined && issuerAddress.length <= MAX_ISSUER_LENGTH
              }
            >
              <Typography
                component="span"
                variant="caption"
                style={{
                  marginLeft: '15px',
                  fontSize: 'smaller',
                  fontStyle: 'italic',
                  color: SECONDARY_GRAY
                }}
              >
                {formattedIssuerAddress}
              </Typography>
            </Tooltip>
          ) : null}
        </Typography>
        <Typography variant="body2" style={{ color: SECONDARY_GRAY }}>
          {formatToken(balance, token)}
        </Typography>
      </div>
    </div>
  );
});
