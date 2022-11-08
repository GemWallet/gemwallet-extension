import { Dispatch, FC, SetStateAction, useState, useCallback } from 'react';

import { TextField, Typography } from '@mui/material';

import { useWallet } from '../../../../contexts';
import { PageWithStepper } from '../../../templates';

export interface ConfirmSeedProps {
  activeStep: number;
  steps: number;
  handleBack: () => void;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export const ConfirmSeed: FC<ConfirmSeedProps> = ({
  activeStep,
  steps,
  handleBack,
  setActiveStep
}) => {
  const { wallets, selectedWallet } = useWallet();
  const [seedError, setSeedError] = useState('');

  const handleNext = useCallback(() => {
    if (
      (document.getElementById('seed') as HTMLInputElement).value === wallets[selectedWallet].seed
    ) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setSeedError('Seed incorrect');
    }
  }, [selectedWallet, setActiveStep, wallets]);

  return (
    <PageWithStepper
      steps={steps}
      activeStep={activeStep}
      buttonText="Confirm"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '120px' }}>
        Confirm Your Secret Seed
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        Enter your seed to confirm that you have properly stored it.
      </Typography>
      <TextField
        fullWidth
        id="seed"
        key="seed"
        name="seed"
        label="Seed"
        error={!!seedError}
        helperText={seedError}
        style={{ marginTop: '20px' }}
        autoComplete="off"
      />
    </PageWithStepper>
  );
};
