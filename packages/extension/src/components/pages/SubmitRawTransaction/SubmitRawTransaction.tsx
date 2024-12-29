import { useState, useCallback, FC, useMemo } from 'react';

import { Button, Tooltip, Typography } from '@mui/material';
import { highlight, languages } from 'prismjs';
import { useNavigate } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { validate } from 'xrpl';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';

import { Chain } from '@gemwallet/constants';

import {
  SETTINGS_PATH,
  SIGN_TRANSACTION_PATH,
  STORAGE_MESSAGING_KEY,
  SUBMIT_TRANSACTION_PATH
} from '../../../constants';
import { useNetwork, useWallet } from '../../../contexts';
import { generateKey, saveInChromeSessionStorage } from '../../../utils';
import { PageWithReturn } from '../../templates';

export const SubmitRawTransaction: FC = () => {
  const { getCurrentWallet } = useWallet();
  const { hasOfflineBanner } = useNetwork();
  const editorHeight = useMemo(() => {
    return hasOfflineBanner ? '250px' : '310px';
  }, [hasOfflineBanner]);

  const navigate = useNavigate();
  const { chainName } = useNetwork();
  const wallet = getCurrentWallet();

  const [jsonInput, setJsonInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  interface ParsedTransaction {
    Account?: string;
    [key: string]: unknown;
  }

  const validateTx = useCallback(
    (parsed: ParsedTransaction) => {
      if (!('Account' in parsed)) {
        parsed.Account = wallet?.publicAddress;
      }

      if (chainName !== Chain.XAHAU) {
        // Transaction validation is not supported for Xahau for now
        validate(parsed);
      }
    },
    [chainName, wallet?.publicAddress]
  );

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
      validateTx(parsed);
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
  }, [jsonInput, navigate, validateTx]);

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
      validateTx(parsed);
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
  }, [jsonInput, navigate, validateTx]);

  const handleBeautifyJson = useCallback(() => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const beautifiedJson = JSON.stringify(parsedJson, null, 2);
      setJsonInput(beautifiedJson);
      setErrorMessage('');
    } catch (e) {
      setErrorMessage('Invalid JSON - cannot beautify');
    }
  }, [jsonInput]);

  const jsonEditorStyle = `
    .json-editor {
      outline: none;
    }`;

  return (
    <PageWithReturn title="Submit Raw Transaction" onBackClick={handleBack}>
      <style>{jsonEditorStyle}</style>
      <div style={{ margin: '1rem' }}>
        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
          Please type or paste your JSON data:
        </Typography>
        <div style={{ maxHeight: editorHeight, overflow: 'auto' }}>
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
              minHeight: editorHeight
            }}
          />
        </div>
        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
          <Button variant="outlined" size="small" onClick={handleBeautifyJson}>
            Beautify JSON
          </Button>
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
        <Tooltip
          title={
            !hasOfflineBanner
              ? 'Note: You can directly Sign & Submit a raw transaction with the Submit button'
              : ''
          }
        >
          <Button variant="outlined" size="large" onClick={handleSignTransaction} color="primary">
            Sign
          </Button>
        </Tooltip>
        <Tooltip title={hasOfflineBanner ? 'Submitting is only available in online mode' : ''}>
          <span>
            <Button
              variant="outlined"
              size="large"
              onClick={handleSubmitTransaction}
              disabled={hasOfflineBanner}
              color="primary"
            >
              Submit
            </Button>
          </span>
        </Tooltip>
      </div>
    </PageWithReturn>
  );
};
