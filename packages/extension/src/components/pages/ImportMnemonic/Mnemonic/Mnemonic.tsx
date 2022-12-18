import { FC, useCallback, useState } from 'react';

import { TextField, Typography } from '@mui/material';

import { useWallet } from '../../../../contexts';
import { PageWithStepper } from '../../../templates';

export interface MnemonicProps {
  activeStep: number;
  steps: number;
  onBack: () => void;
  onNext: (mnemonic: string) => void;
}

export const Mnemonic: FC<MnemonicProps> = ({ activeStep, steps, onBack, onNext }) => {
  const [mnemonicError, setMnemonicError] = useState('');
  const { isValidMnemonic } = useWallet();

  const handleNext = useCallback(() => {
    const mnemonicValue = (document.getElementById('mnemonic') as HTMLInputElement).value;
    if (isValidMnemonic(mnemonicValue)) {
      onNext(mnemonicValue);
    } else {
      setMnemonicError('Your mnemonic is invalid');
    }
  }, [isValidMnemonic, onNext]);

  return (
    <PageWithStepper
      steps={steps}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={onBack}
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
