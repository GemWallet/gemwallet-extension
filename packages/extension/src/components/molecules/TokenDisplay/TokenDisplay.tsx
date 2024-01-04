import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Paper, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';
import { TokenDisplayData, getTrustLineData } from '../../../utils';
import { IconTextButton } from '../../atoms/IconTextButton';
import { TokenInfo } from './TokenInfo';

export interface TokenDisplayProps {
  balance: number;
  token: string;
  issuer?: string;
  isMainToken?: boolean;
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
  isMainToken = false,
  trustlineLimit,
  trustlineNoRipple,
  onExplainClick,
  onTrustlineDetailsClick,
  style
}) => {
  const [tokenData, setTokenData] = useState<TokenDisplayData | undefined>(undefined);

  useEffect(() => {
    if (!issuer) {
      return;
    }

    getTrustLineData({ token, issuer })
      .then((data) => {
        setTokenData(data);
      })
      .catch((error) => {
        console.error(error);
      });
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
        <TokenInfo
          isMainToken={isMainToken}
          tokenIconUrl={tokenData?.tokenIconUrl}
          token={token}
          tokenWarningMessage={tokenWarningMessage}
          balance={balance}
          issuerName={tokenData?.issuerName}
          issuerAddress={issuer}
        />
      ) : (
        <TokenInfo
          isMainToken={isMainToken}
          tokenIconUrl={tokenData?.tokenIconUrl}
          token={token}
          tokenWarningMessage={tokenWarningMessage}
          balance={balance}
          issuerAddress={issuer}
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
