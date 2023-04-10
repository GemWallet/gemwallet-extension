import { FC, useCallback, useState } from 'react';

import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  IMPORT_MNEMONIC_PATH,
  IMPORT_SECRET_NUMBERS_PATH,
  IMPORT_SEED_PATH,
  LIST_WALLETS_PATH
} from '../../../../constants';
import { ButtonOption } from '../../../atoms';
import { PageWithStepper } from '../../../templates';
import { ImportMnemonic } from './ImportMnemonic';
import { ImportSecretNumbers } from './ImportSecretNumbers';
import { ImportSeed } from './ImportSeed';

const SECRET_TYPES = [
  {
    name: 'Family Seed',
    description: 'Looks like sXXX1234XXX...',
    link: IMPORT_SEED_PATH
  },
  {
    name: 'Mnemonic',
    description: 'Based on multiple words',
    link: IMPORT_MNEMONIC_PATH
  },
  {
    name: 'Secret numbers',
    description: '8 rows of 6 digits',
    link: IMPORT_SECRET_NUMBERS_PATH
  }
];

export interface ImportNewWalletProps {
  password: string;
}

export const ImportNewWallet: FC<ImportNewWalletProps> = ({ password }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState(-1);
  const { t } = useTranslation('common');

  const handleBack = useCallback(() => {
    navigate(LIST_WALLETS_PATH);
  }, [navigate]);

  const handleNext = useCallback(() => {
    setActiveStep(selectedAccount + 1);
  }, [setActiveStep, selectedAccount]);

  if (activeStep === 3) {
    return (
      <ImportSecretNumbers
        activeStep={activeStep}
        password={password}
        handleBack={() => setActiveStep(0)}
      />
    );
  }

  if (activeStep === 2) {
    return (
      <ImportMnemonic
        activeStep={activeStep}
        password={password}
        handleBack={() => setActiveStep(0)}
      />
    );
  }

  if (activeStep === 1) {
    return (
      <ImportSeed activeStep={activeStep} password={password} handleBack={() => setActiveStep(0)} />
    );
  }

  return (
    <PageWithStepper
      steps={0}
      activeStep={0}
      buttonText={t('TEXT_NEXT')}
      handleBack={handleBack}
      handleNext={handleNext}
      disabledNext={selectedAccount === -1}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
        Import Wallet
      </Typography>
      <Typography
        variant="subtitle1"
        component="h2"
        style={{ marginTop: '30px', marginBottom: '20px' }}
      >
        Please select your account secret type
      </Typography>
      {SECRET_TYPES.map(({ name, description }, index) => (
        <ButtonOption
          key={index}
          name={name}
          description={description}
          isSelected={selectedAccount === index}
          onClick={() =>
            selectedAccount === index ? setSelectedAccount(-1) : setSelectedAccount(index)
          }
        />
      ))}
    </PageWithStepper>
  );
};
