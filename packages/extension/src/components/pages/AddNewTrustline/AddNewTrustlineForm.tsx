import { FC, FocusEvent, useCallback, useMemo, useState } from 'react';

import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ADD_NEW_TRUSTLINE_PATH, HOME_PATH } from '../../../constants';
import { NumericInput } from '../../atoms';
import { PageWithReturn } from '../../templates';

export const AddNewTrustlineForm: FC = () => {
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

  const handleTokenChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setErrorToken('');
    setToken(e.target.value);
  }, []);

  const handleIssuerChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setErrorIssuer('');
    setIssuer(e.target.value);
  }, []);

  const handleLimitChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setErrorLimit('');
    setLimit(e.target.value);
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
    navigate(
      `${ADD_NEW_TRUSTLINE_PATH}?value=${limit}&currency=${token}&issuer=${issuer}&inAppCall=true`
    );
  }, [issuer, limit, navigate, token]);

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
