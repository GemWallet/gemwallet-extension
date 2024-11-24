import { FC, useCallback, useState, FocusEvent } from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Checkbox, FormControlLabel, Grid, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ERROR_RED, LIST_WALLETS_PATH, SECONDARY_GRAY } from '../../../../../constants';
import { useNetwork, useWallet } from '../../../../../contexts';
import { PageWithStepper } from '../../../../templates';
import { ECDSA } from 'xrpl';
import { SecretNumberInput } from '../../../../atoms';

const schemaInput = new RegExp(/^[0-9]{6}$/);

type InputErrors = {
  numbersA: string;
  numbersB: string;
  numbersC: string;
  numbersD: string;
  numbersE: string;
  numbersF: string;
  numbersG: string;
  numbersH: string;
};

const DIGIT_ERROR = 'You need 6 digits';

export interface ImportSecretNumbersProps {
  activeStep: number;
  password: string;
  handleBack: () => void;
}

export const ImportSecretNumbers: FC<ImportSecretNumbersProps> = ({
  activeStep,
  password,
  handleBack
}) => {
  const navigate = useNavigate();
  const { importNumbers } = useWallet();
  const { hasOfflineBanner } = useNetwork();
  const [isSecp256k1, setSecp256k1] = useState(false);
  const [numbersError, setNumbersError] = useState('');
  const [inputErrors, setInputErrors] = useState<InputErrors>({
    numbersA: '',
    numbersB: '',
    numbersC: '',
    numbersD: '',
    numbersE: '',
    numbersF: '',
    numbersG: '',
    numbersH: ''
  });

  const handleOnBlurInput = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setInputErrors((prevState) => ({
      ...prevState,
      [e.target.id]: schemaInput.test(e.target.value) ? '' : DIGIT_ERROR
    }));
  }, []);

  const handleNext = useCallback(() => {
    setInputErrors(
      Object.fromEntries(
        Object.keys(inputErrors).map((inputId) => [
          inputId,
          schemaInput.test((document.getElementById(inputId) as HTMLInputElement).value)
            ? ''
            : DIGIT_ERROR
        ])
      ) as InputErrors
    );
    const numbers = Object.keys(inputErrors).map(
      (inputId) => (document.getElementById(inputId) as HTMLInputElement).value
    );

    if (numbers.find((number) => !schemaInput.test(number)) === undefined) {
      const isValidNumbers = importNumbers({
        password,
        numbers,
        algorithm: isSecp256k1 ? ECDSA.secp256k1 : undefined
      });
      if (isValidNumbers) {
        navigate(LIST_WALLETS_PATH);
      } else if (isValidNumbers === false) {
        setNumbersError('Your secret numbers are incorrect.');
      } else {
        setNumbersError('This wallet is already imported');
      }
    }
  }, [importNumbers, inputErrors, isSecp256k1, navigate, password]);

  return (
    <PageWithStepper
      steps={1}
      activeStep={activeStep}
      buttonText="Next"
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '20px' }}>
        Secret numbers
      </Typography>
      <Typography
        variant="subtitle1"
        component="h2"
        style={
          hasOfflineBanner
            ? { marginTop: '10px', marginBottom: '5px' }
            : { marginTop: '20px', marginBottom: '10px' }
        }
      >
        Please enter your secret numbers in order to load your wallet to GemWallet.
      </Typography>
      <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {Array.from({ length: 8 }, (_, i) => {
            const id = `numbers${String.fromCharCode(65 + i)}` as keyof InputErrors;
            return (
              <SecretNumberInput
                key={id}
                id={id}
                label={`Numbers ${String.fromCharCode(65 + i)}`}
                error={inputErrors[id]}
                onBlur={handleOnBlurInput}
              />
            );
          })}
        </Grid>
      </Grid>
      <Typography align="center" variant="caption" display="block" style={{ color: ERROR_RED }}>
        {numbersError}
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={isSecp256k1}
            onChange={() => setSecp256k1(!isSecp256k1)}
            name="setSecp256k1"
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
      />
    </PageWithStepper>
  );
};
