import { FC, useCallback, useState } from 'react';

import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useWallet } from '../../../../contexts';
import { PageWithStepper } from '../../../templates';

export interface SecretSeedProps {
  activeStep: number;
  steps: number;
  onBack: () => void;
  onNext: (seed: string) => void;
}

export const SecretSeed: FC<SecretSeedProps> = ({ activeStep, steps, onBack, onNext }) => {
  const [seedError, setSeedError] = useState('');
  const { isValidSeed } = useWallet();
  const { t } = useTranslation('common');

  const handleNext = useCallback(() => {
    const seedValue = (document.getElementById('seed') as HTMLInputElement).value;
    if (isValidSeed(seedValue)) {
      onNext(seedValue);
    } else {
      setSeedError('Your seed is invalid');
    }
  }, [isValidSeed, onNext]);

  return (
    <PageWithStepper
      steps={steps}
      activeStep={activeStep}
      buttonText={t('TEXT_NEXT')}
      handleBack={onBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '130px' }}>
        {t('TEXT_SECRET_SEED')}
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        {t('TEXT_PLEASE_ENTER_SEED')}
      </Typography>
      <TextField
        fullWidth
        id="seed"
        key="seed"
        name="seed"
        label={t('TEXT_SEED')}
        error={!!seedError}
        helperText={seedError}
        style={{ marginTop: '20px' }}
        autoComplete="off"
      />
    </PageWithStepper>
  );
};
