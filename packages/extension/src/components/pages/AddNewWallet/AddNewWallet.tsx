import { FC, useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { IMPORT_WALLET_PATH } from '../../../constants';
import { PageWithSpinner } from '../../templates';
import { AddWalletMethod } from './AddWalletMethod';
import { ConfirmPassword } from './ConfirmPassword';
import { CreateNewWallet } from './CreateNewWallet';

export const AddNewWallet: FC = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [password, setPassword] = useState<string>();

  const handleCreateNewWallet = useCallback(() => {
    setActiveStep(2);
  }, []);

  const handleImportWallet = useCallback(() => {
    navigate(IMPORT_WALLET_PATH);
  }, [navigate]);

  const handleConfirmPassword = useCallback(() => {
    setActiveStep(1);
  }, []);

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
