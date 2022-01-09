import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TwitterIcon from '@mui/icons-material/Twitter';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useLedger } from '../../../contexts/LedgerContext';
import { PageWithStepper } from '../../templates/PageWithStepper';

export function ImportSeed() {
  const [activeStep, setActiveStep] = useState(0);
  const [seedError, setSeedError] = useState('');
  const { importSeed } = useLedger();
  const navigate = useNavigate();

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    const seedValue = (document.getElementById('seed') as HTMLInputElement).value;
    const isValidSeed = importSeed(seedValue);
    if (isValidSeed) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setSeedError('Your seed is invalid');
    }
  };

  if (activeStep === 1) {
    const handleNext = () => {
      navigate('/home');
    };
    return (
      <PageWithStepper
        steps={2}
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleNext}
        buttonText="Finish"
      >
        <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
          Woo, you're in!
        </Typography>
        <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
          Follow along with product updates or reach out if you have any questions.
        </Typography>
        <Button
          variant="contained"
          startIcon={<TwitterIcon />}
          endIcon={<NavigateNextIcon />}
          style={{ width: '100%', marginTop: '25px' }}
          color="info"
        >
          Follow us on Twitter
        </Button>
      </PageWithStepper>
    );
  }

  return (
    <PageWithStepper
      steps={2}
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
      />
    </PageWithStepper>
  );
}
