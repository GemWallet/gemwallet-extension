import { Dispatch, FC, SetStateAction, useCallback } from 'react';

import { Typography } from '@mui/material';

import { TextCopy } from '../../../molecules';
import { PageWithStepper } from '../../../templates';

export interface SecretSeedProps {
  seed: string;
  activeStep: number;
  steps: number;
  handleBack: () => void;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export const SecretSeed: FC<SecretSeedProps> = ({
  seed,
  activeStep,
  steps,
  handleBack,
  setActiveStep
}) => {
  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [setActiveStep]);

  return (
    <PageWithStepper
      steps={steps}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '120px' }}>
        Secret Seed
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        This is the only way you will be able to recover your account. Please store it somewhere
        safe!
      </Typography>
      <TextCopy text={seed} data-testid="secret-seed" />
    </PageWithStepper>
  );
};
