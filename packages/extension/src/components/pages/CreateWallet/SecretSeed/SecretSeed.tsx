import { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { Wallet } from 'xrpl';
import Typography from '@mui/material/Typography';
import { TextCopy } from '../../../molecules';
import { PageWithStepper } from '../../../templates';
import { STEPS } from '../constants';

interface SecretSeedProps {
  activeStep: number;
  handleBack: () => void;
  setActiveStep: Dispatch<SetStateAction<number>>;
  wallet: Wallet;
}

export const SecretSeed: FC<SecretSeedProps> = ({
  activeStep,
  handleBack,
  setActiveStep,
  wallet
}) => {
  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [setActiveStep]);

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
        This is the only way you will be able to recover your account. Please store it somewhere
        safe!
      </Typography>
      <TextCopy text={wallet!.seed!} />
    </PageWithStepper>
  );
};
