import { FC, useState, useCallback } from 'react';

import { TextField, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';

import { LIST_WALLETS } from '../../../../../constants';
import { useWallet } from '../../../../../contexts';
import { saveWallet } from '../../../../../utils';
import { PageWithStepper } from '../../../../templates';

export interface ImportSeedProps {
  activeStep: number;
  password: string;
  handleBack: () => void;
}

export const ImportSeed: FC<ImportSeedProps> = ({ activeStep, password, handleBack }) => {
  const navigate = useNavigate();
  const { importSeed, wallets } = useWallet();
  const [seedError, setSeedError] = useState('');

  const handleNext = useCallback(() => {
    const isValidSeed = importSeed((document.getElementById('seed') as HTMLInputElement).value);
    if (isValidSeed) {
      try {
        // TODO: This saving logic shouldn't be done here,
        // it should be by default when importSeed is called
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
      setSeedError('Your seed is invalid');
    }
  }, [importSeed, navigate, password, wallets]);

  return (
    <PageWithStepper
      steps={1}
      activeStep={activeStep}
      buttonText="Add Seed"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '120px' }}>
        Enter Your Secret Seed
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        Enter your seed to recover your wallet.
      </Typography>
      <TextField
        fullWidth
        id="seed"
        key="seed"
        name="seed"
        label="Seed"
        error={!!seedError}
        helperText={seedError}
        style={{ marginTop: '20px' }}
        autoComplete="off"
      />
    </PageWithStepper>
  );
};
