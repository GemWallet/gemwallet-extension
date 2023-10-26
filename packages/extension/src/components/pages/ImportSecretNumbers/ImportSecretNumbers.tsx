import { FC, useCallback, useState } from 'react';

import { Wallet } from 'xrpl';

import { SecretNumbers } from './SecretNumbers';
import { numbersToSeed, WalletToSave } from '../../../utils';
import { Congratulations } from '../Congratulations';
import { CreatePassword } from '../CreatePassword';

const STEPS = 3;

export const ImportSecretNumbers: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [wallet, setWallet] = useState<WalletToSave>();

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleSecretNumbers = useCallback((numbers: string[]) => {
    const seed = numbersToSeed(numbers);
    const wallet = Wallet.fromSeed(seed);
    setWallet({
      publicAddress: wallet.address,
      seed
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
    <SecretNumbers
      activeStep={activeStep}
      steps={STEPS}
      onBack={handleBack}
      onNext={handleSecretNumbers}
    />
  );
};
