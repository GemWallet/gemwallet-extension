import { CSSProperties, FC, forwardRef, Ref, useEffect, useMemo, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Paper, Tooltip, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';
import { XRPL_META_URL } from '../../../constants/xrplmeta';
import { XRPLMetaTokenAPIResponse } from '../../../types';
import { formatToken } from '../../../utils';
import { IconTextButton } from '../../atoms/IconTextButton';
import { RenderTokenIcon } from './RenderTokenIcon';

export interface TokenDisplayProps {
  balance: number;
  token: string;
  issuer?: string;
  isXRPToken?: boolean;
  trustlineLimit?: number;
  trustlineNoRipple?: boolean;
  onExplainClick?: () => void;
  onTrustlineDetailsClick?: () => void;
  style?: CSSProperties;
}

interface TokenDisplayData {
  tokenName: string;
  tokenIconUrl?: string;
  issuerName?: string;
  issuerIconUrl?: string;
}

export const TokenDisplay: FC<TokenDisplayProps> = ({
  balance,
  token,
  issuer,
  isXRPToken = false,
  trustlineLimit,
  trustlineNoRipple,
  onExplainClick,
  onTrustlineDetailsClick,
  style
}) => {
  const [tokenData, setTokenData] = useState<TokenDisplayData | undefined>(undefined);

  /* We use the token and issuer to get the logo from XRPL Meta */
  useEffect(() => {
    async function getTrustLineLogo() {
      if (issuer) {
        try {
          // API Reference: https://xrplmeta.org/api
          const res: Response = await fetch(`${XRPL_META_URL}/token/${token}:${issuer}`);
          const json: XRPLMetaTokenAPIResponse = await res.json(); // Make sure this JSON structure conforms to XRPLMetaTokenAPIResponse
          const tokenName: string | undefined = json?.meta?.token?.name ?? token;
          const tokenIconUrl: string | undefined =
            json?.meta?.token?.icon ?? json?.meta?.issuer?.icon;
          const issuerName: string | undefined = json?.meta?.issuer?.name;
          const issuerIconUrl: string | undefined = json?.meta?.issuer?.icon;
          setTokenData({
            tokenName,
            tokenIconUrl,
            issuerName,
            issuerIconUrl
          });
        } catch (error) {
          console.log(`An error occurred: ${error}`);
        }
      }
    }

    getTrustLineLogo();
  }, [issuer, token]);

  /* We a warning if trustline's limit is 0 or if the noRipple flag is set to false */
  const tokenWarningMessage = useMemo(() => {
    if (trustlineLimit === 0 && trustlineNoRipple === false) {
      return 'Trustline limit set to 0 or rippling not prevented';
    }
    if (trustlineLimit === 0) {
      return 'Trustline limit set to 0';
    }
    if (trustlineNoRipple === false) {
      return 'Rippling not prevented';
    }
    return undefined;
  }, [trustlineLimit, trustlineNoRipple]);

  return (
    <Paper
      elevation={5}
      style={{
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        ...style
      }}
    >
      {tokenData?.issuerName ? (
        <Tooltip
          title={
            <>
              <Typography variant="caption" style={{ fontStyle: 'italic' }}>
                Issued by {tokenData.issuerName}
              </Typography>
            </>
          }
          placement="top"
        >
          <TokenInfo
            isXRPToken={isXRPToken}
            tokenIconUrl={tokenData?.tokenIconUrl}
            token={token}
            tokenWarningMessage={tokenWarningMessage}
            balance={balance}
          />
        </Tooltip>
      ) : (
        <TokenInfo
          isXRPToken={isXRPToken}
          tokenIconUrl={tokenData?.tokenIconUrl}
          token={token}
          tokenWarningMessage={tokenWarningMessage}
          balance={balance}
        />
      )}
      {onExplainClick ? (
        <IconTextButton onClick={onExplainClick}>
          <InfoOutlinedIcon style={{ color: SECONDARY_GRAY }} fontSize="small" />
          <Typography variant="body2" style={{ color: SECONDARY_GRAY, marginLeft: '3px' }}>
            Explain
          </Typography>
        </IconTextButton>
      ) : null}
      {onTrustlineDetailsClick ? (
        <IconTextButton onClick={onTrustlineDetailsClick}>
          <EditIcon style={{ color: SECONDARY_GRAY }} fontSize="small" />
          <Typography variant="body2" style={{ color: SECONDARY_GRAY, marginLeft: '3px' }}>
            Edit
          </Typography>
        </IconTextButton>
      ) : null}
    </Paper>
  );
};

interface TokenInfoProps {
  isXRPToken: boolean;
  tokenIconUrl: string | undefined;
  token: string;
  tokenWarningMessage: string | undefined;
  balance: number;
}

const TokenInfo = forwardRef((props: TokenInfoProps, ref: Ref<HTMLDivElement>) => {
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
