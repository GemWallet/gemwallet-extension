import { FC, useCallback, useState } from 'react';

import { TextField, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';

import { LIST_WALLETS } from '../../../../../constants';
import { useWallet } from '../../../../../contexts';
import { saveWallet } from '../../../../../utils';
import { PageWithStepper } from '../../../../templates';

export interface ImportMnemonicProps {
  activeStep: number;
  password: string;
  handleBack: () => void;
}

export const ImportMnemonic: FC<ImportMnemonicProps> = ({ activeStep, password, handleBack }) => {
  const navigate = useNavigate();
  const { importMnemonic, wallets } = useWallet();
  const [mnemonicError, setMnemonicError] = useState('');

  const handleNext = useCallback(() => {
    const isValidMnemonic = importMnemonic(
      (document.getElementById('mnemonic') as HTMLInputElement).value
    );
    if (isValidMnemonic) {
      try {
        // TODO: This saving logic shouldn't be done here,
        // it should be by default when importMnemonic is called
        const _wallet = {
          publicAddress: wallets[wallets.length - 1]!.publicAddress,
          seed: wallets[wallets.length - 1]!.seed
        };
        saveWallet(_wallet, password);
        navigate(LIST_WALLETS);
      } catch (e) {
        Sentry.captureException(e);
      }
    } else {
      setMnemonicError('Your mnemonic is invalid');
    }
  }, [importMnemonic, navigate, password, wallets]);

  return (
    <PageWithStepper
      steps={1}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '140px' }}>
        Mnemonic
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        Please enter your mnemonic in order to load your wallet to GemWallet.
      </Typography>
      <TextField
        fullWidth
        id="mnemonic"
        key="mnemonic"
        name="mnemonic"
        label="Mnemonic"
        error={!!mnemonicError}
        helperText={mnemonicError}
        style={{ marginTop: '20px' }}
        autoComplete="off"
      />
    </PageWithStepper>
  );
};
