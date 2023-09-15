import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Paper, Tooltip, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';
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
  const [tokenIconUrl, setTokenIconUrl] = useState<string>('');

  /* We use the token and issuer to get the logo from XRPL Meta */
  useEffect(() => {
    async function getTrustLineLogo() {
      if (issuer) {
        try {
          // API Reference: https://xrplmeta.org/api
          const res: Response = await fetch(`https://s1.xrplmeta.org/token/${token}:${issuer}`);
          const json: XRPLMetaTokenAPIResponse = await res.json(); // Make sure this JSON structure conforms to XRPLMetaTokenAPIResponse
          const icon: string | undefined = json?.meta?.token?.icon ?? json?.meta?.issuer?.icon;
          setTokenIconUrl(icon);
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <RenderTokenIcon {...{ isXRPToken, tokenIconUrl, token }} />
        <div style={{ marginLeft: '10px' }}>
          <Tooltip title={tokenWarningMessage} placement="top">
            <Typography
              style={tokenWarningMessage ? { color: 'brown', cursor: 'help' } : undefined}
            >
              {token}
            </Typography>
          </Tooltip>
          <Typography variant="body2" style={{ color: SECONDARY_GRAY }}>
            {formatToken(balance, token)}
          </Typography>
        </div>
      </div>
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
