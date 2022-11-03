import { FC, useCallback, useState } from 'react';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { PageWithStepper } from '../../templates';
import {
  IMPORT_MNEMONIC_PATH,
  IMPORT_SEED_PATH,
  SECONDARY_GRAY,
  WELCOME_PATH
} from '../../../constants';
import { useNavigate } from 'react-router-dom';

interface SecretTypeProps {
  name: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}
const SecretType: FC<SecretTypeProps> = ({ name, description, isSelected, onClick }) => {
  return (
    <Card
      style={{
        marginBottom: '20px'
      }}
      onClick={onClick}
    >
      <CardActionArea>
        <CardContent
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'initial',
            border: `solid ${isSelected ? '#FFFFFF' : SECONDARY_GRAY}`
          }}
        >
          <Box>
            <Typography gutterBottom>{name}</Typography>
            <Typography variant="subtitle2" color={SECONDARY_GRAY}>
              {description}
            </Typography>
          </Box>
          {isSelected ? <CheckIcon /> : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

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
  }
];

export const ImportWallet: FC = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState(-1);

  const handleBack = useCallback(() => {
    navigate(WELCOME_PATH);
  }, [navigate]);

  const handleNext = useCallback(() => {
    navigate(SECRET_TYPES[selectedAccount].link);
  }, [navigate, selectedAccount]);

  return (
    <PageWithStepper
      steps={0}
      activeStep={0}
      buttonText="Next"
      handleBack={handleBack}
      handleNext={handleNext}
      disabledNext={selectedAccount === -1}
    >
      <Typography variant="h4" component="h1">
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
        <SecretType
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
