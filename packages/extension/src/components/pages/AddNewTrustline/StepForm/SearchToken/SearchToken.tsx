import { ChangeEvent, Dispatch, FC, useCallback, useState } from 'react';

import { TextField, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';

import { LIMIT_API_RESULTS, MIN_SEARCH_LENGTH, XRPL_META_URL } from '../../../../../constants';
import { XRPLMetaTokensListAPIResponse } from '../../../../../types';
import { TokenData, TokenModal } from '../../TokenModal';

export interface SearchTokenProps {
  setIssuer: Dispatch<React.SetStateAction<string>>;
  setToken: Dispatch<React.SetStateAction<string>>;
}

export const SearchToken: FC<SearchTokenProps> = ({ setIssuer, setToken }) => {
  const [isFetching, setIsFetching] = useState(true);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [searchedTokens, setSearchedTokens] = useState<TokenData[]>([]);
  const [searchError, setSearchError] = useState<string>('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const selectToken = useCallback(
    (token: TokenData) => {
      setIssuer(token.issuer);
      setToken(token.currency);
      setIsTokenModalOpen(false);
    },
    [setIssuer, setToken]
  );

  const fetchAllTokens = useCallback(async (searchTerm: string) => {
    if (searchTerm === '') {
      return;
    }

    const fetchTokensPage = async (offset = 0): Promise<TokenData[]> => {
      const url = `${XRPL_META_URL}/tokens?name_like=${searchTerm}&limit=${LIMIT_API_RESULTS}&offset=${offset}`;

      const res: Response = await fetch(url);
      const json: XRPLMetaTokensListAPIResponse = (await res.json()) || [];
      const hasNextPage = json.tokens.length >= LIMIT_API_RESULTS;

      const tokenData = json.tokens
        .map((token) => ({
          name: token.meta.token.name,
          icon: token.meta.token.icon,
          currency: token.currency,
          issuer: token.issuer,
          issuerName: token.meta.issuer.name,
          issuerIcon: token.meta.issuer.icon,
          trustLevel: token.meta.token.trust_level,
          issuerTrustLevel: token.meta.issuer.trust_level
        }))
        .filter(
          (token) =>
            token.currency !== undefined &&
            token.issuer !== undefined &&
            token.trustLevel >= 3 &&
            token.issuerTrustLevel >= 3
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      if (hasNextPage) {
        return [...tokenData, ...(await fetchTokensPage(offset + LIMIT_API_RESULTS))];
      } else {
        return tokenData;
      }
    };

    try {
      const allTokenData = await fetchTokensPage();
      setSearchedTokens(allTokenData);
    } catch (error) {
      Sentry.captureException(error);
    }
  }, []);

  const handleOpenTokenModal = useCallback(
    (searchTerm: string) => {
      if (searchTerm.length === 0) {
        setSearchError('');
      } else if (searchTerm.length < MIN_SEARCH_LENGTH) {
        setSearchError(`Query must be at least ${MIN_SEARCH_LENGTH} characters.`);
      } else {
        setIsTokenModalOpen(true);
        fetchAllTokens(searchTerm)
          .then(() => {
            setIsFetching(false);
          })
          .catch((e) => {
            Sentry.captureException(e);
          });
      }
    },
    [fetchAllTokens]
  );

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length > 0 && e.target.value.length >= MIN_SEARCH_LENGTH) {
        setSearchError('');
      }

      // Clear the previous timeout if there is one
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Set a new timeout for 1 second (1000 milliseconds)
      const newTimeoutId = setTimeout(() => {
        handleOpenTokenModal(e.target.value);
      }, 1000);
      // Update the timeoutId state
      setTimeoutId(newTimeoutId);
    },
    [handleOpenTokenModal, timeoutId]
  );

  return (
    <>
      <TokenModal
        open={isTokenModalOpen}
        tokens={searchedTokens}
        isFetching={isFetching}
        onClose={() => setIsTokenModalOpen(false)}
        onSelectToken={selectToken}
      />
      <Typography variant="h6" style={{ marginBottom: '5px' }}>
        Search token
      </Typography>
      <TextField
        label="Search by name or issuer"
        id="searchToken"
        name="searchToken"
        fullWidth
        onChange={handleSearchChange}
        error={!!searchError}
        helperText={searchError}
        style={{ marginTop: '5px', marginBottom: '10px' }}
        autoComplete="off"
      />
    </>
  );
};
