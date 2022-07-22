import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useLedger } from '../../../../contexts';
import { PageWithStepper } from '../../../templates';
import { STEPS } from '../constants';

interface SecretSeedProps {
  activeStep: number;
  handleBack: () => void;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export const SecretSeed: FC<SecretSeedProps> = ({ activeStep, handleBack, setActiveStep }) => {
  const [seedError, setSeedError] = useState('');
  const { importSeed } = useLedger();

  const handleNext = useCallback(() => {
    const seedValue = (document.getElementById('seed') as HTMLInputElement).value;
    const isValidSeed = importSeed(seedValue);
    if (isValidSeed) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setSeedError('Your seed is invalid');
    }
  }, [importSeed, setActiveStep]);

  return (
    <PageWithStepper
      steps={STEPS}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
        Secret Seed
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        Please enter your seed in order to load your wallet to GemWallet.
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
