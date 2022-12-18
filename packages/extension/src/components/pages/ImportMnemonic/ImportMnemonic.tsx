import { FC, useCallback, useState } from 'react';

import { Wallet } from 'xrpl';

import { WalletToSave } from '../../../utils';
import { Congratulations } from '../Congratulations';
import { CreatePassword } from '../CreatePassword';
import { Mnemonic } from './Mnemonic';

const STEPS = 3;

export const ImportMnemonic: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [wallet, setWallet] = useState<WalletToSave>();

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleMnemonic = useCallback((mnemonic: string) => {
    const wallet = Wallet.fromMnemonic(mnemonic);
    setWallet({
      publicAddress: wallet.address,
      mnemonic
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
    <Mnemonic activeStep={activeStep} steps={STEPS} onBack={handleBack} onNext={handleMnemonic} />
  );
};
