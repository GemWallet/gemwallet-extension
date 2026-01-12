import { FC, useCallback, useEffect, useState } from 'react';

import { Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';

import { MPTOKEN_REMOVE_PATH, SECONDARY_GRAY, STORAGE_MESSAGING_KEY } from '../../../constants';
import { useNetwork } from '../../../contexts';
import { MPTokenDisplayData } from '../../../types/mptoken.types';
import { fetchAllMPTokenDisplayData } from '../../../utils/fetchMPTokenData';
import { generateKey, saveInChromeSessionStorage } from '../../../utils';
import { MPTokenDisplay } from '../../molecules/MPTokenDisplay';

export interface MPTokenListingProps {
  address: string;
}

export const MPTokenListing: FC<MPTokenListingProps> = ({ address }) => {
  const [mpTokens, setMPTokens] = useState<MPTokenDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { client } = useNetwork();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMPTokens() {
      if (!client) {
        setIsLoading(false);
        return;
      }

      try {
        const tokens = await fetchAllMPTokenDisplayData(client, address);
        setMPTokens(tokens);
      } catch (e) {
        Sentry.captureException(e);
        console.error('Error fetching MPTokens:', e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMPTokens();
  }, [address, client]);

  const handleRemoveClick = useCallback(
    (mpToken: MPTokenDisplayData) => {
      const key = generateKey();
      saveInChromeSessionStorage(
        key,
        JSON.stringify({
          mptIssuanceId: mpToken.mptIssuanceId,
          tokenName: mpToken.ticker || mpToken.name || mpToken.mptIssuanceId,
          issuer: mpToken.issuer,
          issuerName: mpToken.issuerName
        })
      ).then(() => {
        navigate(`${MPTOKEN_REMOVE_PATH}?inAppCall=true&${STORAGE_MESSAGING_KEY}=${key}`);
      });
    },
    [navigate]
  );

  // Don't render anything if no MPTokens
  if (!isLoading && mpTokens.length === 0) {
    return null;
  }

  // Show loading state only when actively loading
  if (isLoading) {
    return null;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <Typography
        variant="subtitle2"
        style={{
          color: SECONDARY_GRAY,
          marginBottom: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        MPTokens
      </Typography>
      {mpTokens.map((token) => (
        <MPTokenDisplay
          key={token.mptIssuanceId}
          mpToken={token}
          onRemoveClick={token.canRemove ? () => handleRemoveClick(token) : undefined}
        />
      ))}
    </div>
  );
};
