import { useState, useEffect, FC, useCallback } from 'react';
import { Wallet } from 'xrpl';
import { useLedger } from '../../../contexts/LedgerContext';
import { PageWithSpinner } from '../../templates';
import { SecretSeed } from './SecretSeed';
import { ConfirmSeed } from './ConfirmSeed';
import { CreatePassword } from './CreatePassword';
import { Congratulations } from '../ImportSeed/Congratulations';

export const CreateWallet: FC = () => {
  const [wallet, setWallet] = useState<Wallet | undefined>();
  const [activeStep, setActiveStep] = useState(0);
  const { generateWallet } = useLedger();

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
    throw new Error("Seed wasn't generated properly within the Create Wallet");
  }

  if (activeStep === 3) {
    return <Congratulations activeStep={activeStep} handleBack={handleBack} />;
  }

  if (activeStep === 2) {
    return (
      <CreatePassword
        activeStep={activeStep}
        handleBack={handleBack}
        setActiveStep={setActiveStep}
        wallet={wallet}
      />
    );
  }

  if (activeStep === 1) {
    return (
      <ConfirmSeed
        activeStep={activeStep}
        handleBack={handleBack}
        setActiveStep={setActiveStep}
        wallet={wallet}
      />
    );
  }

  return (
    <SecretSeed
      activeStep={activeStep}
      handleBack={handleBack}
      setActiveStep={setActiveStep}
      wallet={wallet}
    />
  );
};
