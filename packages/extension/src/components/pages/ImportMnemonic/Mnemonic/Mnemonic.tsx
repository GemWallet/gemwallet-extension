import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';

import { TextField, Typography } from '@mui/material';

import { useWallet } from '../../../../contexts';
import { PageWithStepper } from '../../../templates';

export interface MnemonicProps {
  activeStep: number;
  steps: number;
  handleBack: () => void;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export const Mnemonic: FC<MnemonicProps> = ({ activeStep, steps, handleBack, setActiveStep }) => {
  const [mnemonicError, setMnemonicError] = useState('');
  const { importMnemonic } = useWallet();

  const handleNext = useCallback(() => {
    const mnemonicValue = (document.getElementById('mnemonic') as HTMLInputElement).value;
    const isValidMnemonic = importMnemonic(mnemonicValue);
    if (isValidMnemonic) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setMnemonicError('Your mnemonic is invalid');
    }
  }, [importMnemonic, setActiveStep]);

  return (
    <PageWithStepper
      steps={steps}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '140px' }}>
        Mnemonic
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        Please enter your mnemonic in order to load your wallet to GemWallet.
      </Typography>
      <TextField
        fullWidth
        id="mnemonic"
        key="mnemonic"
        name="mnemonic"
        label="Mnemonic"
        error={!!mnemonicError}
        helperText={mnemonicError}
        style={{ marginTop: '20px' }}
        autoComplete="off"
      />
    </PageWithStepper>
  );
};
