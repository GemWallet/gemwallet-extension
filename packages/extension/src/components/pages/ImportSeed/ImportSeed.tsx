import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TwitterIcon from '@mui/icons-material/Twitter';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useLedger } from '../../../contexts/LedgerContext';
import { PageWithStepper } from '../../templates/PageWithStepper';
import { saveSeed } from '../../../utils';
import { TWITTER_LINK } from '../../../constants/links';

const STEPS = 3;

export function ImportSeed() {
  const [activeStep, setActiveStep] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [seedError, setSeedError] = useState('');
  const { importSeed, wallet } = useLedger();
  const navigate = useNavigate();
  const { search } = useLocation();

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

  if (activeStep === 2) {
    const handleNext = () => {
      if (search.includes('transaction=payment')) {
        navigate(`/transaction${search}`);
      } else {
        navigate(`/home${search}`);
      }
    };
    return (
      <PageWithStepper
        steps={STEPS}
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
          onClick={() => {
            window.open(TWITTER_LINK, '_blank');
          }}
        >
          Follow us on Twitter
        </Button>
      </PageWithStepper>
    );
  }

  if (activeStep === 1) {
    const handleNext = () => {
      const passwordValue = (document.getElementById('password') as HTMLInputElement).value;
      const confirmPasswordValue = (document.getElementById('confirm-password') as HTMLInputElement)
        .value;
      if (passwordValue.length < 8 || confirmPasswordValue.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
      } else if (passwordValue !== confirmPasswordValue) {
        setPasswordError('Passwords must match');
      } else if (wallet?.seed) {
        saveSeed(wallet?.seed, passwordValue);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    };
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
      </PageWithStepper>
    );
  }

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
      />
    </PageWithStepper>
  );
}
