import { FC, useState, useCallback } from 'react';

import { TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { LIST_WALLETS } from '../../../../../constants';
import { useWallet } from '../../../../../contexts';
import { PageWithStepper } from '../../../../templates';

export interface ImportSeedProps {
  activeStep: number;
  password: string;
  handleBack: () => void;
}

export const ImportSeed: FC<ImportSeedProps> = ({ activeStep, password, handleBack }) => {
  const navigate = useNavigate();
  const { importSeed } = useWallet();
  const [seedError, setSeedError] = useState('');

  const handleNext = useCallback(() => {
    const isValidSeed = importSeed(
      password,
      (document.getElementById('seed') as HTMLInputElement).value
    );
    if (isValidSeed) {
      navigate(LIST_WALLETS);
    } else {
      setSeedError('Your seed is invalid');
    }
  }, [importSeed, navigate, password]);

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
