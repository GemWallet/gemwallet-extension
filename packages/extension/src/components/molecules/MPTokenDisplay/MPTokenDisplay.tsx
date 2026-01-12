import { CSSProperties, FC, useMemo } from 'react';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TokenIcon from '@mui/icons-material/Token';
import { Avatar, Paper, Tooltip, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';
import { MPTokenDisplayData } from '../../../types/mptoken.types';
import { formatToken } from '../../../utils';
import { truncateMPTIssuanceId } from '../../../utils/fetchMPTokenData';
import { IconTextButton } from '../../atoms/IconTextButton';

export interface MPTokenDisplayProps {
  mpToken: MPTokenDisplayData;
  onRemoveClick?: () => void;
  style?: CSSProperties;
}

const MAX_NAME_LENGTH = 12;
const MAX_ISSUER_LENGTH = 16;

export const MPTokenDisplay: FC<MPTokenDisplayProps> = ({ mpToken, onRemoveClick, style }) => {
  const displayName = useMemo(() => {
    // Priority: ticker > name > truncated issuance ID
    const name = mpToken.ticker || mpToken.name;
    if (name) {
      return name.length > MAX_NAME_LENGTH ? `${name.slice(0, MAX_NAME_LENGTH)}...` : name;
    }
    return truncateMPTIssuanceId(mpToken.mptIssuanceId, 6, 4);
  }, [mpToken.ticker, mpToken.name, mpToken.mptIssuanceId]);

  const fullName = useMemo(() => {
    return mpToken.ticker || mpToken.name || mpToken.mptIssuanceId;
  }, [mpToken.ticker, mpToken.name, mpToken.mptIssuanceId]);

  const displayIssuer = useMemo(() => {
    if (mpToken.issuerName) {
      return mpToken.issuerName.length > MAX_ISSUER_LENGTH
        ? `${mpToken.issuerName.slice(0, MAX_ISSUER_LENGTH)}...`
        : mpToken.issuerName;
    }
    if (mpToken.issuer) {
      return mpToken.issuer.length > MAX_ISSUER_LENGTH
        ? `${mpToken.issuer.slice(0, MAX_ISSUER_LENGTH)}...`
        : mpToken.issuer;
    }
    return undefined;
  }, [mpToken.issuerName, mpToken.issuer]);

  const fullIssuer = useMemo(() => {
    return mpToken.issuerName || mpToken.issuer || '';
  }, [mpToken.issuerName, mpToken.issuer]);

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
        {mpToken.iconUrl ? (
          <Avatar src={mpToken.iconUrl} alt={displayName} sx={{ width: 32, height: 32 }} />
        ) : (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <TokenIcon fontSize="small" />
          </Avatar>
        )}
        <div style={{ marginLeft: '10px' }}>
          <Tooltip
            title={fullName}
            placement="top"
            arrow
            disableHoverListener={fullName === displayName}
          >
            <Typography>
              {displayName}
              {displayIssuer && (
                <Tooltip
                  title={fullIssuer}
                  placement="top"
                  arrow
                  disableHoverListener={fullIssuer === displayIssuer}
                >
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
                    by {displayIssuer}
                  </Typography>
                </Tooltip>
              )}
            </Typography>
          </Tooltip>
          <Typography variant="body2" style={{ color: SECONDARY_GRAY }}>
            {formatToken(mpToken.formattedBalance, mpToken.ticker || mpToken.name || 'MPT')}
          </Typography>
        </div>
      </div>
      {onRemoveClick && mpToken.canRemove && (
        <Tooltip title="Remove MPToken authorization" placement="top" arrow>
          <IconTextButton onClick={onRemoveClick}>
            <DeleteOutlineIcon style={{ color: SECONDARY_GRAY }} fontSize="small" />
            <Typography variant="body2" style={{ color: SECONDARY_GRAY, marginLeft: '3px' }}>
              Remove
            </Typography>
          </IconTextButton>
        </Tooltip>
      )}
    </Paper>
  );
};
