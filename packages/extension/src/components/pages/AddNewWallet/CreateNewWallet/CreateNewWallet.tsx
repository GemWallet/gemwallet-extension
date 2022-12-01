import { useState, useEffect, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'xrpl';

import { LIST_WALLETS } from '../../../../constants';
import { useWallet } from '../../../../contexts';
import { saveWallet } from '../../../../utils';
import { PageWithSpinner } from '../../../templates';
import { ConfirmSeed } from '../../CreateWallet/ConfirmSeed';
import { SecretSeed } from '../../CreateWallet/SecretSeed';
import { STEPS } from './constants';

export interface CreateNewWalletProps {
  password: string;
}

export const CreateNewWallet: FC<CreateNewWalletProps> = ({ password }) => {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState<Wallet | undefined>();
  const [activeStep, setActiveStep] = useState<number>(0);
  const { generateWallet } = useWallet();

  useEffect(() => {
    const wallet = generateWallet();
    setWallet(wallet);
  }, [generateWallet]);

  useEffect(() => {
    if (activeStep === 2) {
      try {
        const _wallet = {
          publicAddress: wallet!.address,
          seed: wallet!.seed
        };
        saveWallet(_wallet, password);
        navigate(LIST_WALLETS);
      } catch (e) {
        Sentry.captureException(e);
      }
    }
  }, [activeStep, navigate, password, wallet]);

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

  if (activeStep === 2) {
    return <PageWithSpinner />;
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
