import { FC, useCallback, useState, FocusEvent } from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Checkbox, FormControlLabel, Grid, TextField, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ERROR_RED, LIST_WALLETS_PATH, SECONDARY_GRAY } from '../../../../../constants';
import { useWallet } from '../../../../../contexts';
import { PageWithStepper } from '../../../../templates';
import styles from './styles.module.css';
import { ECDSA } from 'xrpl';

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
        style={{ marginTop: '20px', marginBottom: '10px' }}
      >
        Please enter your secret numbers in order to load your wallet to GemWallet.
      </Typography>
      <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <TextField
            size="small"
            id="numbersA"
            name="numbersA"
            label="Numbers A"
            error={Boolean(inputErrors.numbersA)}
            helperText={inputErrors.numbersA}
            style={{
              marginTop: '15px',
              marginBottom: inputErrors.numbersA ? '0px' : '20px',
              width: '110px'
            }}
            className={styles.textField}
            autoComplete="off"
            onBlur={handleOnBlurInput}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            size="small"
            id="numbersB"
            name="numbersB"
            label="Numbers B"
            error={Boolean(inputErrors.numbersB)}
            helperText={inputErrors.numbersB}
            style={{
              marginTop: '15px',
              marginBottom: inputErrors.numbersB ? '0px' : '20px',
              width: '110px'
            }}
            className={styles.textField}
            autoComplete="off"
            onBlur={handleOnBlurInput}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            size="small"
            id="numbersC"
            name="numbersC"
            label="Numbers C"
            error={Boolean(inputErrors.numbersC)}
            helperText={inputErrors.numbersC}
            style={{
              marginTop: '15px',
              marginBottom: inputErrors.numbersC ? '0px' : '20px',
              width: '110px'
            }}
            className={styles.textField}
            autoComplete="off"
            onBlur={handleOnBlurInput}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            size="small"
            id="numbersD"
            name="numbersD"
            label="Numbers D"
            error={Boolean(inputErrors.numbersD)}
            helperText={inputErrors.numbersD}
            style={{
              marginTop: '15px',
              marginBottom: inputErrors.numbersD ? '0px' : '20px',
              width: '110px'
            }}
            className={styles.textField}
            autoComplete="off"
            onBlur={handleOnBlurInput}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            size="small"
            id="numbersE"
            name="numbersE"
            label="Numbers E"
            error={Boolean(inputErrors.numbersE)}
            helperText={inputErrors.numbersE}
            style={{
              marginTop: '15px',
              marginBottom: inputErrors.numbersE ? '0px' : '20px',
              width: '110px'
            }}
            className={styles.textField}
            autoComplete="off"
            onBlur={handleOnBlurInput}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            size="small"
            id="numbersF"
            name="numbersF"
            label="Numbers F"
            error={Boolean(inputErrors.numbersF)}
            helperText={inputErrors.numbersF}
            style={{
              marginTop: '15px',
              marginBottom: inputErrors.numbersF ? '0px' : '20px',
              width: '110px'
            }}
            className={styles.textField}
            autoComplete="off"
            onBlur={handleOnBlurInput}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            size="small"
            id="numbersG"
            name="numbersG"
            label="Numbers G"
            error={Boolean(inputErrors.numbersG)}
            helperText={inputErrors.numbersG}
            style={{
              marginTop: '15px',
              marginBottom: inputErrors.numbersG ? '0px' : '20px',
              width: '110px'
            }}
            className={styles.textField}
            autoComplete="off"
            onBlur={handleOnBlurInput}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            size="small"
            id="numbersH"
            name="numbersH"
            label="Numbers H"
            error={Boolean(inputErrors.numbersH)}
            helperText={inputErrors.numbersH}
            style={{
              marginTop: '15px',
              marginBottom: inputErrors.numbersH ? '0px' : '20px',
              width: '110px'
            }}
            className={styles.textField}
            autoComplete="off"
            onBlur={handleOnBlurInput}
          />
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
        style={{ marginTop: '5px' }}
      />
    </PageWithStepper>
  );
};
