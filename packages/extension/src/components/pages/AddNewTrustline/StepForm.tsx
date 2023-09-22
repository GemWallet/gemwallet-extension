import { ChangeEvent, FC, FocusEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { Button, TextField, Typography } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { isValidAddress } from 'xrpl';

import { Network } from '@gemwallet/constants';

import { HOME_PATH, MAX_TOKEN_LENGTH } from '../../../constants';
import { useNetwork } from '../../../contexts';
import { useKeyUp } from '../../../hooks';
import { XRPLMetaTokensListAPIResponse } from '../../../types';
import { NumericInput } from '../../atoms';
import { PageWithReturn } from '../../templates';
import { TokenData, TokenModal } from './TokenModal';

interface InitialValues {
  issuer: string;
  token: string;
  limit: number;
  noRipple: boolean;
}

interface StepFormProps {
  onTrustlineSubmit: (
    issuer: string,
    token: string,
    limit: string,
    noRipple: boolean,
    showForm: boolean,
    isParamsMissing: boolean
  ) => void;
  initialValues?: InitialValues;
}

export const StepForm: FC<StepFormProps> = ({ onTrustlineSubmit, initialValues }) => {
  const [issuer, setIssuer] = useState<string>(initialValues?.issuer || '');
  const [token, setToken] = useState<string>(initialValues?.token || '');
  const [limit, setLimit] = useState<string>(initialValues?.limit.toString() || '');
  const [noRipple, setNoRipple] = useState<boolean>(initialValues?.noRipple ?? true);
  const [errorIssuer, setErrorIssuer] = useState<string>('');
  const [errorToken, setErrorToken] = useState<string>('');
  const [errorLimit, setErrorLimit] = useState<string>('');
  // Search token functionality
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedTokens, setSearchedTokens] = useState<TokenData[]>([]);
  const navigate = useNavigate();
  const { networkName } = useNetwork();

  const handleBack = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

  const handleTokenChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length > MAX_TOKEN_LENGTH) {
      setErrorToken('Your token is too long.');
    } else {
      setErrorToken('');
    }
    setToken(e.target.value);
  }, []);

  const handleIssuerBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value !== '') {
      setErrorIssuer(!isValidAddress(e.target.value) ? 'Your issuer address is invalid' : '');
    }
  }, []);

  const handleIssuerChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setErrorIssuer('');
    setIssuer(e.target.value);
  }, []);

  const handleLimitChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < 0 && e.target.value !== '') {
      setErrorLimit('The limit cannot be a negative number');
    } else {
      setErrorLimit('');
    }

    if (!Number.isNaN(Number(e.target.value))) {
      setLimit(e.target.value);
    }
  }, []);

  const handleNoRippleChange = useCallback((event) => {
    setNoRipple(event.target.checked);
  }, []);

  const isAddTrustlineDisabled = useMemo(() => {
    return !(
      issuer !== '' &&
      token !== '' &&
      limit !== '' &&
      errorIssuer === '' &&
      errorToken === '' &&
      errorLimit === ''
    );
  }, [errorIssuer, errorLimit, errorToken, issuer, limit, token]);

  const handleAddTrustline = useCallback(() => {
    onTrustlineSubmit(issuer, token, limit, noRipple, false, false);
  }, [noRipple, issuer, limit, onTrustlineSubmit, token]);

  // Fetch all tokens on mount
  useEffect(() => {
    async function fetchAllTokens() {
      let url = `https://s1.xrplmeta.org/tokens?limit=1000`;
      if (searchTerm !== '') {
        url = `https://s1.xrplmeta.org/tokens?name_like=${searchTerm}&limit=1000`;
      }

      try {
        // API Reference: https://xrplmeta.org/api
        const res: Response = await fetch(url);
        const json: XRPLMetaTokensListAPIResponse = (await res.json()) || [];
        const allTokenData = json.tokens
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
          // Only accept valid tokens with a trust level of 3 (issuer & token)
          .filter(
            (token) =>
              token.currency !== undefined &&
              token.issuer !== undefined &&
              token.trustLevel === 3 &&
              token.issuerTrustLevel === 3
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setSearchedTokens(allTokenData);
      } catch (error) {
        Sentry.captureException(error);
      }
    }

    fetchAllTokens();
  }, [searchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenTokenModal = () => {
    setIsTokenModalOpen(true);
  };

  useKeyUp('Enter', handleOpenTokenModal);

  const selectToken = (token: TokenData) => {
    setIssuer(token.issuer);
    setToken(token.currency);
    setIsTokenModalOpen(false);
  };

  return (
    <PageWithReturn
      title={initialValues ? 'Edit trustline' : 'Add trustline'}
      onBackClick={handleBack}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}
    >
      {initialValues ? (
        <div style={{ margin: '15px' }}>
          <div>
            <Typography variant="body2" color="textSecondary">
              Tip: To remove a trustline, set the limit to 0.
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
              (However, it will remain visible if the balance is not 0).
            </Typography>
          </div>
        </div>
      ) : null}
      <div style={{ margin: '20px' }}>
        {networkName === Network.MAINNET ? (
          <>
            <TokenModal
              open={isTokenModalOpen}
              tokens={searchedTokens}
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
              style={{ marginTop: '5px', marginBottom: '10px' }}
              autoComplete="off"
            />
          </>
        ) : null}
        <Typography
          variant="h6"
          style={{
            marginTop: networkName === Network.MAINNET ? '15px' : '0',
            marginBottom: '5px'
          }}
        >
          Enter details manually
        </Typography>
        <TextField
          label="Issuer"
          id="issuer"
          name="issuer"
          fullWidth
          error={!!errorIssuer}
          helperText={errorIssuer}
          onChange={handleIssuerChange}
          onBlur={handleIssuerBlur}
          style={{ marginTop: '5px', marginBottom: '10px' }}
          autoComplete="off"
          value={issuer}
          disabled={!!initialValues}
        />
        <TextField
          label="Token"
          id="token"
          name="token"
          fullWidth
          error={!!errorToken}
          helperText={errorToken}
          onChange={handleTokenChange}
          style={{ marginTop: '20px', marginBottom: '10px' }}
          autoComplete="off"
          value={token}
          disabled={!!initialValues}
        />
        <NumericInput
          label="Limit"
          id="limit"
          name="limit"
          fullWidth
          style={{ marginTop: '20px', marginBottom: '10px' }}
          error={!!errorLimit}
          helperText={errorLimit}
          onChange={handleLimitChange}
          autoComplete="off"
          initialValue={limit}
        />
        {initialValues ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={noRipple}
                onChange={handleNoRippleChange}
                name="noRipple"
                color="primary"
              />
            }
            label="Prevent Rippling"
            style={{
              marginTop: '5px',
              color: '#bababa'
            }}
          />
        ) : null}
        {initialValues ? (
          <Typography
            variant="body2"
            component="p"
            style={{
              fontStyle: 'italic',
              color: '#757575',
              marginBottom: '10px'
            }}
          >
            Recommended: Enable Prevent Rippling.
          </Typography>
        ) : null}
        <Button
          fullWidth
          variant="contained"
          onClick={handleAddTrustline}
          disabled={isAddTrustlineDisabled}
          style={{ marginTop: '20px', marginBottom: '10px' }}
        >
          {initialValues ? 'Edit trustline' : 'Add trustline'}
        </Button>
      </div>
    </PageWithReturn>
  );
};
