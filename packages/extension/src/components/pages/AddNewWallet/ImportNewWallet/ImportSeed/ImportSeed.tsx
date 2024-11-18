import { FC, useCallback, useRef, useState } from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Checkbox, FormControlLabel, TextField, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { LIST_WALLETS_PATH, SECONDARY_GRAY } from '../../../../../constants';
import { useWallet } from '../../../../../contexts';
import { PageWithStepper } from '../../../../templates';
import { ECDSA } from 'xrpl';

export interface ImportSeedProps {
  activeStep: number;
  password: string;
  handleBack: () => void;
}

export const ImportSeed: FC<ImportSeedProps> = ({ activeStep, password, handleBack }) => {
  const navigate = useNavigate();
  const { importSeed } = useWallet();
  const [seedError, setSeedError] = useState('');
  const [isSecp256k1, setIsSecp256k1] = useState(false);
  const seedRef = useRef<HTMLInputElement | null>(null);

  const handleNext = useCallback(() => {
    const seedValue = seedRef.current?.value;
    if (seedValue !== undefined) {
      const isValidSeed = importSeed({
        password,
        seed: seedValue,
        algorithm: isSecp256k1 ? ECDSA.secp256k1 : undefined
      });
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
  }, [importSeed, isSecp256k1, navigate, password]);

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
        inputRef={seedRef}
        error={!!seedError}
        helperText={seedError}
        style={{ marginTop: '20px' }}
        autoComplete="off"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isSecp256k1}
            onChange={() => setIsSecp256k1(!isSecp256k1)}
            name="setIsSecp256k1"
            color="primary"
            style={{ transform: 'scale(0.9)' }}
          />
        }
        label={
          <Typography style={{ display: 'flex', fontSize: '0.9rem' }} color={SECONDARY_GRAY}>
            Use "secp256k1" algorithm{' '}
            <Tooltip title="Note: if you don’t know what it means, you should probably keep it unchecked">
              <InfoOutlinedIcon style={{ marginLeft: '5px' }} fontSize="small" />
            </Tooltip>
          </Typography>
        }
        style={{ marginTop: '5px' }}
      />
    </PageWithStepper>
  );
};
