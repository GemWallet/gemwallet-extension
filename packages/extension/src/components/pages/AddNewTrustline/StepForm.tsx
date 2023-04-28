import { FC, FocusEvent, useCallback, useMemo, useState } from 'react';

import { Button, TextField } from '@mui/material';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isValidAddress } from 'xrpl';

import { HOME_PATH, MAX_TOKEN_LENGTH } from '../../../constants';
import { NumericInput } from '../../atoms';
import { PageWithReturn } from '../../templates';

interface InitialValues {
  issuer: string;
  token: string;
  limit: number;
}

interface StepFormProps {
  onTrustlineSubmit: (
    issuer: string,
    token: string,
    limit: string,
    showForm: boolean,
    isParamsMissing: boolean
  ) => void;
  initialValues?: InitialValues;
}

export const StepForm: FC<StepFormProps> = ({ onTrustlineSubmit, initialValues }) => {
  const [issuer, setIssuer] = useState<string>(initialValues?.issuer || '');
  const [token, setToken] = useState<string>(initialValues?.token || '');
  const [limit, setLimit] = useState<string>(initialValues?.limit.toString() || '');
  const [errorIssuer, setErrorIssuer] = useState<string>('');
  const [errorToken, setErrorToken] = useState<string>('');
  const [errorLimit, setErrorLimit] = useState<string>('');
  const navigate = useNavigate();

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

    if (!isNaN(Number(e.target.value))) {
      setLimit(e.target.value);
    }
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
    onTrustlineSubmit(issuer, token, limit, false, false);
  }, [issuer, limit, onTrustlineSubmit, token]);

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
        <div style={{ margin: '20px' }}>
          <div style={{ margin: '20px' }}>
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
        <TextField
          label="Issuer"
          id="issuer"
          name="issuer"
          fullWidth
          error={!!errorIssuer}
          helperText={errorIssuer}
          onChange={handleIssuerChange}
          onBlur={handleIssuerBlur}
          style={{ marginTop: '20px', marginBottom: '10px' }}
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
