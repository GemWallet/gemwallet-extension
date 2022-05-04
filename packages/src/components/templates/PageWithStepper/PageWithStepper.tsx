import { FC, useEffect } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';

type PropType = {
  steps: number;
  activeStep: number;
  buttonText: string;
  handleBack: () => void;
  handleNext: () => void;
};

export const PageWithStepper: FC<PropType> = ({
  steps,
  activeStep,
  buttonText,
  handleBack,
  handleNext,
  children
}) => {
  /*
   * Handle Next step button by pressing 'Enter'
   */
  useEffect(() => {
    const upHandler = ({ key }: { key: string }) => {
      if (key === 'Enter') {
        handleNext();
      }
    };
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keyup', upHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  return (
    <>
      <MobileStepper
        variant="dots"
        steps={steps}
        position="top"
        activeStep={activeStep}
        nextButton={<div style={{ width: '68.89px' }}></div>}
        backButton={
          <Button size="small" onClick={() => handleBack()} disabled={activeStep === 0}>
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
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={() => handleNext()}>
            {buttonText}
          </Button>
        </Container>
      </Container>
    </>
  );
};
