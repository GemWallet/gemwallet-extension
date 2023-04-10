import { FC, useCallback, useRef, useState } from 'react';

import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LIST_WALLETS_PATH } from '../../../../../constants';
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
  const seedRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation('common');

  const handleNext = useCallback(() => {
    const seedValue = seedRef.current?.value;
    if (seedValue !== undefined) {
      const isValidSeed = importSeed(password, seedValue);
      if (isValidSeed) {
        navigate(LIST_WALLETS_PATH);
      } else if (isValidSeed === false) {
        setSeedError('Your seed is invalid');
      } else {
        setSeedError('This wallet is already imported');
      }
    } else {
      setSeedError('Your seed is empty');
    }
  }, [importSeed, navigate, password]);

  return (
    <PageWithStepper
      steps={1}
      activeStep={activeStep}
      buttonText={t('TEXT_ADD_SEED')}
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '120px' }}>
        {t('TEXT_ENTER_SECRET_SEED')}
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        {t('TEXT_ENTER_SEED_TO_RECOVER_WALLET')}
      </Typography>
      <TextField
        fullWidth
        id="seed"
        key="seed"
        name="seed"
        label={t('TEXT_SEED')}
        inputRef={seedRef}
        error={!!seedError}
        helperText={seedError}
        style={{ marginTop: '20px' }}
        autoComplete="off"
      />
    </PageWithStepper>
  );
};
