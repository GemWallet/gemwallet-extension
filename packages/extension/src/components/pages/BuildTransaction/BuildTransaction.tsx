import { useState, useCallback, FC } from 'react';

import { Button, Typography } from '@mui/material';
import { highlight, languages } from 'prismjs';
import { useNavigate } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { validate } from 'xrpl';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';

import {
  SETTINGS_PATH,
  SIGN_TRANSACTION_PATH,
  STORAGE_MESSAGING_KEY,
  SUBMIT_TRANSACTION_PATH
} from '../../../constants';
import { useWallet } from '../../../contexts';
import { generateKey, saveInChromeSessionStorage } from '../../../utils';
import { PageWithReturn } from '../../templates';

const EDITOR_HEIGHT = '380px';

export const BuildTransaction: FC = () => {
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

  const jsonEditorStyle = `
    .json-editor {
      outline: none;
    }`;

  return (
    <PageWithReturn title="Build Transaction" onBackClick={handleBack}>
      <style>{jsonEditorStyle}</style>
      <div style={{ margin: '1rem' }}>
        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
          Please type or paste your JSON data:
        </Typography>
        <div style={{ maxHeight: EDITOR_HEIGHT, overflow: 'auto' }}>
          <Editor
            value={jsonInput}
            textareaClassName={'json-editor'}
            onValueChange={(input) => setJsonInput(input)}
            highlight={(code) => highlight(code, languages.json, 'json')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              tabSize: 2,
              backgroundColor: '#2d2d2d',
              borderRadius: '2px',
              minHeight: EDITOR_HEIGHT
            }}
          />
        </div>
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
