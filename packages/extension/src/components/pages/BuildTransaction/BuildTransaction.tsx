import { useState, useCallback } from 'react';

import { Button, TextareaAutosize, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { validate } from 'xrpl';

import {
  SETTINGS_PATH,
  SIGN_TRANSACTION_PATH,
  STORAGE_MESSAGING_KEY,
  SUBMIT_TRANSACTION_PATH
} from '../../../constants';
import { useWallet } from '../../../contexts';
import { generateKey, saveInChromeSessionStorage } from '../../../utils';
import { PageWithReturn } from '../../templates';

export const BuildTransaction: React.FC = () => {
  const { getCurrentWallet } = useWallet();

  const navigate = useNavigate();
  const wallet = getCurrentWallet();

  const [jsonInput, setJsonInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  const handleSignTransaction = useCallback(() => {
    const key = generateKey();
    try {
      JSON.parse(jsonInput);
    } catch (e) {
      setErrorMessage('Invalid JSON');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      if (!('Account' in parsed)) {
        parsed.Account = wallet?.publicAddress;
      }

      validate(parsed);
      saveInChromeSessionStorage(key, JSON.stringify({ transaction: parsed })).then(() =>
        navigate(
          `${SIGN_TRANSACTION_PATH}?${STORAGE_MESSAGING_KEY}=${key}&inAppCall=true&sign=transaction`
        )
      );
    } catch (e) {
      setErrorMessage('Invalid transaction');
      return;
    }
    setErrorMessage('');
  }, [jsonInput, navigate, wallet?.publicAddress]);

  const handleSubmitTransaction = useCallback(() => {
    const key = generateKey();
    try {
      JSON.parse(jsonInput);
    } catch (e) {
      setErrorMessage('Invalid JSON');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      if (!('Account' in parsed)) {
        parsed.Account = wallet?.publicAddress;
      }

      validate(parsed);
      saveInChromeSessionStorage(key, JSON.stringify({ transaction: parsed })).then(() =>
        navigate(
          `${SUBMIT_TRANSACTION_PATH}?${STORAGE_MESSAGING_KEY}=${key}&inAppCall=true&submit=transaction`
        )
      );
    } catch (e) {
      setErrorMessage('Invalid transaction');
      return;
    }
    setErrorMessage('');
  }, [jsonInput, navigate, wallet?.publicAddress]);

  return (
    <PageWithReturn title="Build Transaction" onBackClick={handleBack}>
      <div style={{ margin: '1rem' }}>
        <Typography variant="body1">Please enter or paste your JSON data below:</Typography>
        <TextareaAutosize
          minRows={10}
          style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        {errorMessage ? (
          <Typography color="error" style={{ marginTop: '1rem' }}>
            {errorMessage}
          </Typography>
        ) : null}
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          margin: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Button variant="contained" size="large" onClick={handleBack}>
          Cancel
        </Button>
        <Button variant="outlined" size="large" onClick={handleSignTransaction} color="primary">
          Sign
        </Button>
        <Button variant="outlined" size="large" onClick={handleSubmitTransaction} color="primary">
          Submit
        </Button>
      </div>
    </PageWithReturn>
  );
};
