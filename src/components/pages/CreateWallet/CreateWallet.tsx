import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { useLedger } from '../../../contexts/LedgerContext';
import { TextCopy } from '../../molecules/TextCopy';

export function CreateWallet() {
  const [seed, setSeed] = useState('Loading...');
  const [activeStep, setActiveStep] = useState(0);
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

  return (
    <>
      <MobileStepper
        variant="dots"
        steps={6}
        position="top"
        activeStep={activeStep}
        nextButton={<div style={{ width: '68.89px' }}></div>}
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {<KeyboardArrowLeft />}
            Back
          </Button>
        }
        style={{ backgroundColor: '#282c34' }}
      />
      <Container
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
          padding: '30px 5px'
        }}
      >
        <Container style={{ textAlign: 'center', marginTop: '30%' }}>
          <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
            Secret Seed
          </Typography>
          <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
            This is the only way you will be able to recover your account. Please store it somewhere
            safe!
          </Typography>
          <TextCopy text={seed} />
        </Container>
        <Container style={{ display: 'flex', flexDirection: 'column' }}>
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={handleNext}>
            Next
          </Button>
        </Container>
      </Container>
    </>
  );
}
