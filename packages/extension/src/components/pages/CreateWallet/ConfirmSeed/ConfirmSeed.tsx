import { FC, useState, useCallback, useRef } from 'react';

import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { PageWithStepper } from '../../../templates';

export interface ConfirmSeedProps {
  seed: string;
  activeStep: number;
  steps: number;
  handleBack: () => void;
  onConfirm: () => void;
}

export const ConfirmSeed: FC<ConfirmSeedProps> = ({
  seed,
  activeStep,
  steps,
  handleBack,
  onConfirm
}) => {
  const [seedError, setSeedError] = useState('');
  const seedRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation('common');

  const handleNext = useCallback(() => {
    if (seedRef.current?.value === seed) {
      onConfirm();
    } else {
      setSeedError('Seed incorrect');
    }
  }, [seed, onConfirm]);

  return (
    <PageWithStepper
      steps={steps}
      activeStep={activeStep}
      buttonText={t('TEXT_CONFIRM')}
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '120px' }}>
        {t('TEXT_CONFIRM_SECRET_SEED')}
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        {t('TEXT_CONFIRM_SECRET_SEED_DETAILS')}
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
