import { FC, useCallback, useState } from 'react';

import { ECDSA, Wallet } from 'xrpl';

import { WalletToSave } from '../../../utils';
import { Congratulations } from '../Congratulations';
import { CreatePassword } from '../CreatePassword';
import { SecretSeed } from './SecretSeed';

const STEPS = 2;

export const ImportSeed: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [wallet, setWallet] = useState<WalletToSave>();

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleSecretSeed = useCallback((seed: string, algorithm: ECDSA | undefined) => {
    const wallet = Wallet.fromSeed(seed, { algorithm });
    setWallet({
      publicAddress: wallet.address,
      seed,
      algorithm
    });
    setActiveStep(1);
  }, []);

  if (activeStep === 2) {
    return <Congratulations />;
  }

  if (activeStep === 1) {
    return (
      <CreatePassword
        wallet={wallet!}
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
      onBack={handleBack}
      onNext={handleSecretSeed}
    />
  );
};
