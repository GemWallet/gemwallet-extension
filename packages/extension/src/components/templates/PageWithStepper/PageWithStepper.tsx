import { FC } from 'react';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { Button, Container, MobileStepper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useNetwork } from '../../../contexts';
import { useKeyUp } from '../../../hooks';

export interface PageWithStepperProps {
  steps: number;
  activeStep: number;
  buttonText?: string;
  handleBack: () => void;
  handleNext?: () => void;
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
  const { isConnectionFailed } = useNetwork();

  //Handle Next step button by pressing 'Enter'
  useKeyUp('Enter', handleNext ? handleNext : () => {});

  const handleBackButton = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else {
      handleBack();
    }
  };

  return (
    <div
      style={
        isConnectionFailed
          ? {
              width: '100%',
              position: 'fixed',
              top: 56
            }
          : undefined
      }
    >
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
        style={{ backgroundColor: '#282c34', top: isConnectionFailed ? 56 : undefined }}
      />
      <Container
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: isConnectionFailed ? `calc(100vh - 56px)` : '100vh',
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
        {buttonText && handleNext ? (
          <Container style={{ display: 'flex', flexDirection: 'column', marginTop: '24px' }}>
            <Button variant="contained" onClick={() => handleNext()} disabled={disabledNext}>
              {buttonText}
            </Button>
          </Container>
        ) : null}
      </Container>
    </div>
  );
};
