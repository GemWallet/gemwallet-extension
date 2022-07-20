import { Dispatch, FC, SetStateAction, useState, useCallback } from 'react';
import { Wallet } from 'xrpl';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { PageWithStepper } from '../../../templates';
import { saveWallet } from '../../../../utils';
import { ERROR_RED } from '../../../../constants';
import { STEPS } from '../constants';

interface CreatePasswordProps {
  activeStep: number;
  handleBack: () => void;
  setActiveStep: Dispatch<SetStateAction<number>>;
  wallet: Wallet;
}

export const CreatePassword: FC<CreatePasswordProps> = ({
  activeStep,
  handleBack,
  setActiveStep,
  wallet
}) => {
  const [saveWalletError, setSaveWalletError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleNext = useCallback(() => {
    const passwordValue = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPasswordValue = (document.getElementById('confirm-password') as HTMLInputElement)
      .value;
    if (passwordValue.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else if (passwordValue !== confirmPasswordValue) {
      setPasswordError('Passwords must match');
    } else {
      const _wallet = {
        publicAddress: wallet!.address,
        seed: wallet!.seed!
      };
      try {
        saveWallet(_wallet, passwordValue);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } catch (e) {
        setSaveWalletError(
          'Something went wrong while trying to save your wallet, please try again'
        );
      }
    }
  }, [setActiveStep, wallet]);

  return (
    <PageWithStepper
      steps={STEPS}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
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
        error={!!passwordError}
        type="password"
        style={{ marginTop: '20px' }}
      />
      <TextField
        fullWidth
        id="confirm-password"
        key="confirm-password"
        name="confirm-password"
        label="Confirm Password"
        error={!!passwordError}
        helperText={passwordError}
        type="password"
        style={{ marginTop: '20px' }}
      />
      {saveWalletError ? (
        <Typography variant="body2" style={{ marginTop: '15px', color: ERROR_RED }}>
          {saveWalletError}
        </Typography>
      ) : null}
    </PageWithStepper>
  );
};
