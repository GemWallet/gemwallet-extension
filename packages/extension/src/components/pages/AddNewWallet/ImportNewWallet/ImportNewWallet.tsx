import { FC, useCallback, useState } from 'react';

import { Typography } from '@mui/material';
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
    description: '8 rows of 6 digits (XUMM import)',
    link: IMPORT_SECRET_NUMBERS_PATH
  }
];

export interface ImportNewWalletProps {
  password: string;
}

export const ImportNewWallet: FC<ImportNewWalletProps> = ({ password }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleBack = useCallback(() => {
    navigate(LIST_WALLETS_PATH);
  }, [navigate]);

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
    <PageWithStepper steps={0} activeStep={0} handleBack={handleBack}>
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
          onClick={() => setActiveStep(index + 1)}
        />
      ))}
    </PageWithStepper>
  );
};
