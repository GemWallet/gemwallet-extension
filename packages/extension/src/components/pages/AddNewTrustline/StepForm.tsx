import {FC, FocusEvent, useCallback, useMemo, useState} from 'react';

import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { HOME_PATH } from '../../../constants';
import { NumericInput } from '../../atoms';
import { PageWithReturn } from '../../templates';

const MAX_TOKEN_LENGTH = 30;

interface StepFormProps {
  onTrustlineSubmit: (issuer: string, token: string, limit: string, showForm: boolean, isParamsMissing: boolean) => void;
}

export const StepForm: FC<StepFormProps> = ({ onTrustlineSubmit }) => {
  const [issuer, setIssuer] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [limit, setLimit] = useState<string>('');
  const [errorIssuer, setErrorIssuer] = useState<string>('');
  const [errorToken, setErrorToken] = useState<string>('');
  const [errorLimit, setErrorLimit] = useState<string>('');
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

  const handleTokenChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (e.target.value.length > MAX_TOKEN_LENGTH) {
        setErrorToken('Your token is too long.');
      } else {
        setErrorToken('');
      }
      setToken(e.target.value);
    },
    []
  );

  const handleIssuerChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setErrorIssuer('');
      setIssuer(e.target.value);
    },
    []
  );

  const handleLimitChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (Number(e.target.value) < 0 && e.target.value !== '') {
        setErrorLimit('The limit cannot be a negative number');
      } else {
        setErrorLimit('');
      }

      if (Number(e.target.value)) {
        setLimit(e.target.value);
      }
    },
    []
  );

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

  const handleAddTrustline = useCallback(
    () => {
      onTrustlineSubmit(issuer, token, limit, false, false);
    },
    [issuer, limit, onTrustlineSubmit, token]
  );

  return (
    <PageWithReturn
      title="Add trustline"
      onBackClick={handleBack}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}
    >
      <div style={{ margin: '20px' }}>
        <TextField
          label="Issuer"
          id="issuer"
          name="issuer"
          fullWidth
          error={!!errorIssuer}
          helperText={errorIssuer}
          onChange={handleIssuerChange}
          style={{ marginTop: '20px', marginBottom: '10px' }}
          autoComplete="off"
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
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleAddTrustline}
          disabled={isAddTrustlineDisabled}
          style={{ marginTop: '20px', marginBottom: '10px' }}
        >
          Add trustline
        </Button>
      </div>
    </PageWithReturn>
  );
};
