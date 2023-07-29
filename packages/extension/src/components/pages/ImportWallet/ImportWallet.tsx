import { FC, useCallback, useState } from 'react';

import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  IMPORT_MNEMONIC_PATH,
  IMPORT_SECRET_NUMBERS_PATH,
  IMPORT_SEED_PATH,
  WELCOME_PATH
} from '../../../constants';
import { ButtonOption } from '../../atoms';
import { PageWithStepper } from '../../templates';

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

export const ImportWallet: FC = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  const handleBack = useCallback(() => {
    navigate(WELCOME_PATH);
  }, [navigate]);

  const handleNext = useCallback(() => {
    if (selectedAccount !== null) {
      navigate(SECRET_TYPES[selectedAccount].link);
    }
  }, [navigate, selectedAccount]);

  return (
    <PageWithStepper
      steps={0}
      activeStep={0}
      buttonText="Next"
      handleBack={handleBack}
      handleNext={handleNext}
      disabledNext={selectedAccount === null}
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
          onClick={() => setSelectedAccount((prev) => (prev === index ? null : index))}
        />
      ))}
    </PageWithStepper>
  );
};
