import { FC, FocusEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { Button, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isValidAddress } from 'xrpl';

import { Network } from '@gemwallet/constants';

import { HOME_PATH, MAX_TOKEN_LENGTH } from '../../../../constants';
import { useNetwork } from '../../../../contexts';
import { NumericInput } from '../../../atoms';
import { PageWithReturn } from '../../../templates';
import { SearchToken } from './SearchToken';

interface InitialValues {
  issuer: string;
  token: string;
  limit: number;
  noRipple: boolean;
}

export interface StepFormProps {
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
    const inputValue = e.target.value;
    const isNegative = Number(inputValue) < 0;
    const isValidNumber = /^\d*\.?\d*$/.test(inputValue);
    const [, fractionalPart] = inputValue.split('.');

    if (
      inputValue !== '' &&
      !isNegative &&
      isValidNumber &&
      (fractionalPart === undefined ||
        (/^\d*\.?\d*$/.test(fractionalPart) && fractionalPart.length <= 6))
    ) {
      setErrorLimit('');
      setLimit(inputValue);
    } else if (/^\d*\.?\d*$/.test(fractionalPart) && fractionalPart.length > 6) {
      setErrorLimit('Fractional part should have at most 6 digits');
    } else {
      setErrorLimit(isNegative ? 'The limit cannot be a negative number' : 'Invalid input');
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

  const canSearchTokens = useMemo(() => {
    return networkName === Network.MAINNET && !initialValues;
  }, [initialValues, networkName]);

  useEffect(() => {
    if (initialValues) {
      setIssuer(initialValues.issuer);
      setToken(initialValues.token);
      setLimit(initialValues.limit.toString());
      setNoRipple(initialValues.noRipple);
    }
  }, [initialValues]);

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
        {canSearchTokens ? <SearchToken setIssuer={setIssuer} setToken={setToken} /> : null}
        {!initialValues ? (
          <Typography
            variant="h6"
            style={{
              marginTop: canSearchTokens ? '15px' : '0',
              marginBottom: '5px'
            }}
          >
            Enter details manually
          </Typography>
        ) : null}
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
