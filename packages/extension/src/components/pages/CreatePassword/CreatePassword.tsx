import { Dispatch, FC, SetStateAction, useCallback, useRef, useState } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';

import {
  GEM_WALLET,
  InternalReceivePasswordContentMessage,
  MSG_INTERNAL_RECEIVE_PASSWORD
} from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { WalletToSave, saveWallet } from '../../../utils';
import { PageWithStepper } from '../../templates';

export interface CreatePasswordProps {
  wallet: WalletToSave;
  activeStep: number;
  steps: number;
  handleBack: () => void;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export const CreatePassword: FC<CreatePasswordProps> = ({
  wallet,
  activeStep,
  steps,
  handleBack,
  setActiveStep
}) => {
  const [passwordError, setPasswordError] = useState('');
  const [saveWalletError, setSaveWalletError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding the password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing/hiding the confirm password
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

  const handleNext = useCallback(() => {
    // Clear old errors when user attempts to proceed
    setPasswordError('');
    setSaveWalletError('');

    const passwordValue: string | undefined = passwordRef.current?.value;
    const confirmPasswordValue: string | undefined = confirmPasswordRef.current?.value;
    if (passwordValue === undefined || passwordValue == null || passwordValue.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else if (passwordValue !== confirmPasswordValue) {
      setPasswordError('Passwords must match');
    } else {
      try {
        saveWallet(wallet, confirmPasswordValue);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

        if (process.env.NODE_ENV === 'production') {
          chrome.runtime
            .sendMessage<InternalReceivePasswordContentMessage>({
              app: GEM_WALLET,
              type: MSG_INTERNAL_RECEIVE_PASSWORD,
              payload: {
                password: passwordValue
              }
            })
            .catch((e) => {
              Sentry.captureException(e);
            });
        }
      } catch (e) {
        Sentry.captureException(e);
        setSaveWalletError(
          'Something went wrong while trying to save your wallet, please try again'
        );
      }
    }
  }, [setActiveStep, wallet]);

  // Clear old errors when user interacts with the password field
  const handlePasswordChange = () => {
    setPasswordError('');
  };

  // Clear old errors when user interacts with the confirm password field
  const handleConfirmPasswordChange = () => {
    setPasswordError('');
  };

  return (
    <PageWithStepper
      steps={steps}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '100px' }}>
        Create a password
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        You will use this password to unlock your wallet
      </Typography>
      <TextField
        fullWidth
        id="password"
        key="password"
        name="password"
        label="Password"
        inputRef={passwordRef}
        error={!!passwordError}
        type={showPassword ? 'text' : 'password'} // Toggle between text and password type
        style={{ marginTop: '20px' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        onChange={handlePasswordChange} // Clear old errors when user interacts with this field
      />
      <TextField
        fullWidth
        id="confirm-password"
        key="confirm-password"
        name="confirm-password"
        label="Confirm Password"
        inputRef={confirmPasswordRef}
        error={!!passwordError}
        helperText={passwordError}
        type={showConfirmPassword ? 'text' : 'password'} // Toggle between text and password type
        style={{ marginTop: '20px' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        onChange={handleConfirmPasswordChange} // Clear old errors when user interacts with this field
      />
      {saveWalletError ? (
        <Typography variant="body2" style={{ marginTop: '15px', color: ERROR_RED }}>
          {saveWalletError}
        </Typography>
      ) : null}
    </PageWithStepper>
  );
};
