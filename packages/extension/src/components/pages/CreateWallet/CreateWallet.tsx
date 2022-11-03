import { useState, useEffect, FC, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { Wallet } from 'xrpl';
import { useWallet } from '../../../contexts';
import { PageWithSpinner } from '../../templates';
import { SecretSeed } from './SecretSeed';
import { ConfirmSeed } from './ConfirmSeed';
import { CreatePassword } from '../CreatePassword';
import { Congratulations } from '../Congratulations';

const STEPS = 4;

export const CreateWallet: FC = () => {
  const [wallet, setWallet] = useState<Wallet | undefined>();
  const [activeStep, setActiveStep] = useState(0);
  const { generateWallet } = useWallet();

  useEffect(() => {
    const wallet = generateWallet();
    setWallet(wallet);
  }, [generateWallet]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  if (!wallet) {
    return <PageWithSpinner />;
  }

  if (!wallet!.seed) {
    const error = new Error("Seed wasn't generated properly within the Create Wallet");
    Sentry.captureException(error);
    throw error;
  }

  if (activeStep === 3) {
    return <Congratulations activeStep={activeStep} steps={STEPS} handleBack={handleBack} />;
  }

  if (activeStep === 2) {
    return (
      <CreatePassword
        activeStep={activeStep}
        steps={STEPS}
        handleBack={handleBack}
        setActiveStep={setActiveStep}
      />
    );
  }

  if (activeStep === 1) {
    return (
      <ConfirmSeed
        activeStep={activeStep}
        steps={STEPS}
        handleBack={handleBack}
        setActiveStep={setActiveStep}
      />
    );
  }

  return (
    <SecretSeed
      activeStep={activeStep}
      steps={STEPS}
      handleBack={handleBack}
      setActiveStep={setActiveStep}
    />
  );
};
