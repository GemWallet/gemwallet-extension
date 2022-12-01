import { FC, useCallback, useState } from 'react';

import { PageWithSpinner } from '../../templates';
import { AddWalletMethod } from './AddWalletMethod';
import { ConfirmPassword } from './ConfirmPassword';
import { CreateNewWallet } from './CreateNewWallet';
import { ImportNewWallet } from './ImportNewWallet';

export const AddNewWallet: FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [password, setPassword] = useState<string>();

  const handleCreateNewWallet = useCallback(() => {
    setActiveStep(2);
  }, []);

  const handleImportWallet = useCallback(() => {
    setActiveStep(3);
  }, []);

  const handleConfirmPassword = useCallback(() => {
    setActiveStep(1);
  }, []);

  if (activeStep === 3) {
    if (!password) {
      return <PageWithSpinner />;
    }
    return <ImportNewWallet password={password} />;
  }

  if (activeStep === 2) {
    if (!password) {
      return <PageWithSpinner />;
    }
    return <CreateNewWallet password={password} />;
  }

  if (activeStep === 1) {
    return (
      <AddWalletMethod
        onCreateNewWallet={handleCreateNewWallet}
        onImportWallet={handleImportWallet}
      />
    );
  }

  return <ConfirmPassword setPassword={setPassword} onConfirmPassword={handleConfirmPassword} />;
};
