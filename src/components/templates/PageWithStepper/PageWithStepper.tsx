import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { MouseEventHandler } from 'react';

type PropType = {
  activeStep: number;
  handleBack: MouseEventHandler;
  handleNext: MouseEventHandler;
  children: JSX.Element | JSX.Element[];
};

export function PageWithStepper({ activeStep, handleBack, handleNext, children }: PropType) {
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
        <Container style={{ textAlign: 'center', marginTop: '30%' }}>{children}</Container>
        <Container style={{ display: 'flex', flexDirection: 'column' }}>
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={handleNext}>
            Next
          </Button>
        </Container>
      </Container>
    </>
  );
}
