import { FC, useCallback, useRef, useState } from 'react';

import { TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { LIST_WALLETS } from '../../../../../constants';
import { useWallet } from '../../../../../contexts';
import { PageWithStepper } from '../../../../templates';

export interface ImportMnemonicProps {
  activeStep: number;
  password: string;
  handleBack: () => void;
}

export const ImportMnemonic: FC<ImportMnemonicProps> = ({ activeStep, password, handleBack }) => {
  const navigate = useNavigate();
  const { importMnemonic } = useWallet();
  const [mnemonicError, setMnemonicError] = useState('');
  const mnemonicRef = useRef<HTMLInputElement | null>(null);

  const handleNext = useCallback(() => {
    let mnemonicValue = mnemonicRef.current?.value;
    if (mnemonicValue !== undefined) {
      const isValidMnemonic = importMnemonic(password, mnemonicValue);
      if (isValidMnemonic) {
        navigate(LIST_WALLETS);
      } else if (isValidMnemonic === false) {
        setMnemonicError('Your mnemonic is invalid');
      } else {
        setMnemonicError('This wallet is already imported');
      }
    } else {
      setMnemonicError('Cannot find mnemonic');
    }
  }, [importMnemonic, navigate, password]);

  return (
    <PageWithStepper
      steps={1}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '140px' }}>
        Mnemonic
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        Please enter your mnemonic in order to load your wallet to GemWallet.
      </Typography>
      <TextField
        fullWidth
        id="mnemonic"
        key="mnemonic"
        name="mnemonic"
        label="Mnemonic"
        inputRef={mnemonicRef}
        error={!!mnemonicError}
        helperText={mnemonicError}
        style={{ marginTop: '20px' }}
        autoComplete="off"
      />
    </PageWithStepper>
  );
};
