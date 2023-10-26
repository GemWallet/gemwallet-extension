import { useState, useEffect, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';

import { STEPS } from './constants';
import { LIST_WALLETS_PATH } from '../../../../constants';
import { useWallet } from '../../../../contexts';
import { WalletToSave } from '../../../../utils';
import { PageWithSpinner } from '../../../templates';
import { ConfirmSeed } from '../../CreateWallet/ConfirmSeed';
import { SecretSeed } from '../../CreateWallet/SecretSeed';

export interface CreateNewWalletProps {
  password: string;
}

export const CreateNewWallet: FC<CreateNewWalletProps> = ({ password }) => {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState<WalletToSave | undefined>();
  const [activeStep, setActiveStep] = useState<number>(0);
  const { generateWallet, importSeed } = useWallet();

  useEffect(() => {
    const wallet = generateWallet();
    setWallet({
      publicAddress: wallet.address,
      seed: wallet.seed
    });
  }, [generateWallet]);

  useEffect(() => {
    if (wallet?.seed && activeStep === 2) {
      try {
        importSeed(password, wallet.seed);
        navigate(LIST_WALLETS_PATH);
      } catch (e) {
        Sentry.captureException('Cannot save wallet - CreateNewWallet: ' + e);
      }
    }
  }, [activeStep, importSeed, navigate, password, wallet]);

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

  if (activeStep === 2) {
    return <PageWithSpinner />;
  }

  if (activeStep === 1) {
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

  return (
    <SecretSeed
      seed={wallet.seed}
      activeStep={activeStep}
      steps={STEPS}
      handleBack={handleBack}
      setActiveStep={setActiveStep}
    />
  );
};
