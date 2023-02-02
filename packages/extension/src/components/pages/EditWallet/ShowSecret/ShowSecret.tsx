import { FC, useCallback, useMemo, useRef, useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import WarningIcon from '@mui/icons-material/Warning';
import { Button, Paper, TextField, Typography } from '@mui/material';
import copyToClipboard from 'copy-to-clipboard';

import { useWallet } from '../../../../contexts';
import { useKeyUp, useTimeout } from '../../../../hooks';
import { breakStringByLine } from '../../../../utils';
import { PageWithReturn } from '../../../templates';

type Secret = 'seed' | 'mnemonic';

export interface ShowSecretProps {
  seed?: string;
  mnemonic?: string;
  onBackButton: () => void;
}

export const ShowSecret: FC<ShowSecretProps> = ({ seed, mnemonic, onBackButton }) => {
  const [passwordError, setPasswordError] = useState<string>('');
  const [step, setStep] = useState<'password' | 'showSecret'>('password');
  const [isCopied, setIsCopied] = useState(false);
  const { password } = useWallet();
  const setTimeout = useTimeout(2000);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const secretType: Secret = useMemo(() => (seed ? 'seed' : 'mnemonic'), [seed]);

  const handlePasswordChange = useCallback(() => {
    setPasswordError('');
  }, []);

  const handleConfirmPassword = useCallback(() => {
    const passwordValue = passwordRef.current?.value;
    if (passwordValue === password) {
      setStep('showSecret');
    }
    setPasswordError('Incorrect password');
  }, [password]);

  const handleCopy = useCallback(() => {
    copyToClipboard((seed || mnemonic) as string);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false));
  }, [seed, mnemonic, setTimeout]);

  const handleKeyUp = useCallback(() => {
    if (step === 'password') {
      handleConfirmPassword();
    } else {
      onBackButton();
    }
  }, [handleConfirmPassword, onBackButton, step]);

  // Handle Confirm Password step or Done button by pressing 'Enter'
  useKeyUp('Enter', handleKeyUp);

  return (
    <PageWithReturn title={`Show ${secretType}`} onBackClick={onBackButton}>
      <div
        style={{
          height: '518px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ textAlign: 'center' }}>
            <WarningIcon color="warning" fontSize="large" />
          </div>
          <Typography align="center">
            Do not share your {secretType}! If someone has your {secretType} they will have full
            control of your wallet.
          </Typography>
          {step === 'password' ? (
            <>
              <Typography align="center" variant="body2" style={{ marginTop: '30px' }}>
                Please confirm your password before we show you your {secretType}
              </Typography>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                inputRef={passwordRef}
                error={!!passwordError}
                onChange={handlePasswordChange}
                helperText={passwordError}
                type="password"
                style={{ marginTop: '50px' }}
                autoComplete="off"
              />
            </>
          ) : (
            <>
              <Paper
                onClick={() => console.log('yoo')}
                elevation={5}
                style={{
                  marginTop: '50px',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography>
                  {secretType === 'seed' ? breakStringByLine(seed as string, 30) : mnemonic}
                </Typography>
              </Paper>
              <Paper
                role={'button'}
                aria-label={`Copy ${secretType}`}
                onClick={handleCopy}
                elevation={15}
                style={{
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Typography variant="body1" style={{ marginRight: '5px' }}>
                  Copy
                </Typography>
                {isCopied ? (
                  <DoneIcon color="success" fontSize="small" />
                ) : (
                  <ContentCopyIcon fontSize="small" />
                )}
              </Paper>
            </>
          )}
        </div>
        <div
          style={{
            margin: '1.5rem 0',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {step === 'password' ? (
            <>
              <Button
                variant="outlined"
                size="large"
                style={{ width: '45%' }}
                onClick={onBackButton}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                style={{ width: '45%' }}
                onClick={handleConfirmPassword}
              >
                Show
              </Button>
            </>
          ) : (
            <Button size="large" variant="contained" fullWidth onClick={onBackButton}>
              Done
            </Button>
          )}
        </div>
      </div>
    </PageWithReturn>
  );
};
