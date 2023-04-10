import { FC, useCallback, useState } from 'react';

import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useWallet } from '../../../../contexts';
import { PageWithStepper } from '../../../templates';

export interface MnemonicProps {
  activeStep: number;
  steps: number;
  onBack: () => void;
  onNext: (mnemonic: string) => void;
}

export const Mnemonic: FC<MnemonicProps> = ({ activeStep, steps, onBack, onNext }) => {
  const [mnemonicError, setMnemonicError] = useState('');
  const { isValidMnemonic } = useWallet();
  const { t } = useTranslation('common');

  const handleNext = useCallback(() => {
    const mnemonicValue = (document.getElementById('mnemonic') as HTMLInputElement).value;
    if (isValidMnemonic(mnemonicValue)) {
      onNext(mnemonicValue);
    } else {
      setMnemonicError('Your mnemonic is invalid');
    }
  }, [isValidMnemonic, onNext]);

  return (
    <PageWithStepper
      steps={steps}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={onBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '140px' }}>
        {t('TEXT_MNEMONIC')}
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        {t('TEXT_PLEASE_ENTER_MNEMONIC')}
      </Typography>
      <TextField
        fullWidth
        id="mnemonic"
        key="mnemonic"
        name="mnemonic"
        label={t('TEXT_MNEMONIC')}
        error={!!mnemonicError}
        helperText={mnemonicError}
        style={{ marginTop: '20px' }}
        autoComplete="off"
      />
    </PageWithStepper>
  );
};
