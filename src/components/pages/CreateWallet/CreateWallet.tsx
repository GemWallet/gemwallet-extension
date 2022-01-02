import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField/TextField';
import { useLedger } from '../../../contexts/LedgerContext';
import { TextCopy } from '../../molecules/TextCopy';
import { PageWithStepper } from '../../templates/PageWithStepper';

export function CreateWallet() {
  const [seed, setSeed] = useState('Loading...');
  const [activeStep, setActiveStep] = useState(0);
  const [seedError, setSeedError] = useState('');
  const { createWallet } = useLedger();

  useEffect(() => {
    const seed = createWallet();
    if (seed) {
      setSeed(seed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  if (activeStep === 1) {
    const handleNext = () => {
      if ((document.getElementById('seed') as HTMLInputElement).value === seed) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setSeedError('Seed incorrect');
      }
    };
    return (
      <PageWithStepper activeStep={activeStep} handleBack={handleBack} handleNext={handleNext}>
        <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
          Confirm You Secret Seed
        </Typography>
        <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
          Enter your seed to confirm that you have properly stored it.
        </Typography>
        <form id="seed-form">
          <TextField
            fullWidth
            id="seed"
            name="seed"
            label="Seed"
            error={!!seedError}
            helperText={seedError}
          />
        </form>
      </PageWithStepper>
    );
  }

  return (
    <PageWithStepper activeStep={activeStep} handleBack={handleBack} handleNext={handleNext}>
      <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
        Secret Seed
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        This is the only way you will be able to recover your account. Please store it somewhere
        safe!
      </Typography>
      <TextCopy text={seed} />
    </PageWithStepper>
  );
}
