import { useState, useEffect, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';

import { ConfirmSeed } from './ConfirmSeed';
import { STEPS } from './constants';
import { SecretSeed } from './SecretSeed';
import { useWallet } from '../../../contexts';
import { WalletToSave } from '../../../utils';
import { PageWithSpinner } from '../../templates';
import { Congratulations } from '../Congratulations';
import { CreatePassword } from '../CreatePassword';

export const CreateWallet: FC = () => {
  const [wallet, setWallet] = useState<WalletToSave | undefined>();
  const [activeStep, setActiveStep] = useState(0);
  const { generateWallet } = useWallet();

  useEffect(() => {
    const wallet = generateWallet();
    setWallet({
      publicAddress: wallet.address,
      seed: wallet.seed
    });
  }, [generateWallet]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleConfirmedSeed = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  if (!wallet) {
    return <PageWithSpinner />;
  }

  if (!wallet.seed) {
    const error = new Error("Seed wasn't generated properly within the Create Wallet");
    Sentry.captureException(error);
    throw error;
  }

  if (activeStep === 3) {
    return <Congratulations />;
  }

  if (activeStep === 2) {
    return (
      <ConfirmSeed
        seed={wallet.seed}
        activeStep={activeStep}
        steps={STEPS}
        handleBack={handleBack}
        onConfirm={handleConfirmedSeed}
      />
    );
  }

  if (activeStep === 1) {
    return (
      <SecretSeed
        seed={wallet.seed}
        activeStep={activeStep}
        steps={STEPS}
        handleBack={handleBack}
        setActiveStep={setActiveStep}
      />
    );
  }

  return (
    <CreatePassword
      wallet={wallet}
      activeStep={activeStep}
      steps={STEPS}
      handleBack={handleBack}
      setActiveStep={setActiveStep}
    />
  );
};
