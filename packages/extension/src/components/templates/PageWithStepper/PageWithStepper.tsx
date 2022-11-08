import { FC, useEffect } from 'react';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { Button, Container, MobileStepper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface PageWithStepperProps {
  steps: number;
  activeStep: number;
  buttonText: string;
  handleBack: () => void;
  handleNext: () => void;
  disabledNext?: boolean;
}

export const PageWithStepper: FC<PageWithStepperProps> = ({
  steps,
  activeStep,
  buttonText,
  handleBack,
  handleNext,
  disabledNext = false,
  children
}) => {
  const navigate = useNavigate();

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
  }, [activeStep, handleNext]);

  const handleBackButton = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else {
      handleBack();
    }
  };

  return (
    <>
      <MobileStepper
        variant="dots"
        steps={steps}
        position="top"
        activeStep={activeStep}
        nextButton={<div style={{ width: '68.89px' }}></div>}
        backButton={
          <Button size="small" onClick={handleBackButton}>
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
          padding: '48px 0 24px 0'
        }}
      >
        <Container
          style={{
            height: '100%',
            textAlign: 'center'
          }}
        >
          {children}
        </Container>
        <Container style={{ display: 'flex', flexDirection: 'column', marginTop: '24px' }}>
          <Button variant="contained" onClick={() => handleNext()} disabled={disabledNext}>
            {buttonText}
          </Button>
        </Container>
      </Container>
    </>
  );
};
