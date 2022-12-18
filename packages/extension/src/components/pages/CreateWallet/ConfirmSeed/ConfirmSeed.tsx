import { FC, useState, useCallback } from 'react';

import { TextField, Typography } from '@mui/material';

import { PageWithStepper } from '../../../templates';

export interface ConfirmSeedProps {
  seed: string;
  activeStep: number;
  steps: number;
  handleBack: () => void;
  onConfirm: () => void;
}

export const ConfirmSeed: FC<ConfirmSeedProps> = ({
  seed,
  activeStep,
  steps,
  handleBack,
  onConfirm
}) => {
  const [seedError, setSeedError] = useState('');

  const handleNext = useCallback(() => {
    if ((document.getElementById('seed') as HTMLInputElement).value === seed) {
      onConfirm();
    } else {
      setSeedError('Seed incorrect');
    }
  }, [seed, onConfirm]);

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
