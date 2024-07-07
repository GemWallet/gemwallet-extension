import { FC, useCallback, useState } from 'react';
import { ECDSA } from 'xrpl';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Checkbox, FormControlLabel, TextField, Tooltip, Typography } from '@mui/material';

import { useWallet } from '../../../../contexts';
import { PageWithStepper } from '../../../templates';
import { SECONDARY_GRAY } from '../../../../constants';

export interface SecretSeedProps {
  activeStep: number;
  steps: number;
  onBack: () => void;
  onNext: (seed: string, algorithm: ECDSA | undefined) => void;
}

export const SecretSeed: FC<SecretSeedProps> = ({ activeStep, steps, onBack, onNext }) => {
  const [seedError, setSeedError] = useState('');
  const [isSecp256k1, setSecp256k1] = useState(false);
  const { isValidSeed } = useWallet();

  const handleNext = useCallback(() => {
    const seedValue = (document.getElementById('seed') as HTMLInputElement).value;
    if (isValidSeed(seedValue)) {
      onNext(seedValue, isSecp256k1 ? ECDSA.secp256k1 : undefined);
    } else {
      setSeedError('Your seed is invalid');
    }
  }, [isSecp256k1, isValidSeed, onNext]);

  return (
    <PageWithStepper
      steps={steps}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={onBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '130px' }}>
        Secret Seed
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        Please enter your seed in order to import your wallet to GemWallet.
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
      <FormControlLabel
        control={
          <Checkbox
            checked={isSecp256k1}
            onChange={() => setSecp256k1(!isSecp256k1)}
            name="rememberSession"
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
