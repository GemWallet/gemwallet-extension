import { Dispatch, FC, SetStateAction, useState, useCallback } from 'react';
import { Wallet } from 'xrpl';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { PageWithStepper } from '../../../templates';
import { STEPS } from '../constants';

interface ConfirmSeedProps {
  activeStep: number;
  handleBack: () => void;
  setActiveStep: Dispatch<SetStateAction<number>>;
  wallet: Wallet;
}

export const ConfirmSeed: FC<ConfirmSeedProps> = ({
  activeStep,
  handleBack,
  setActiveStep,
  wallet
}) => {
  const [seedError, setSeedError] = useState('');

  const handleNext = useCallback(() => {
    if ((document.getElementById('seed') as HTMLInputElement).value === wallet!.seed) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setSeedError('Seed incorrect');
    }
  }, [setActiveStep, wallet]);

  return (
    <PageWithStepper
      steps={STEPS}
      activeStep={activeStep}
      buttonText="Confirm"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
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
