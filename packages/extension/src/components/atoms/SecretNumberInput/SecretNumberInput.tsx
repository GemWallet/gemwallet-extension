import { Grid, TextField } from '@mui/material';
import { FC, FocusEvent } from 'react';
import styles from './styles.module.css';
import { useNetwork } from '../../../contexts';

export interface SecretNumberInputProps {
  id: string;
  label: string;
  error: string;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}

export const SecretNumberInput: FC<SecretNumberInputProps> = ({ id, label, error, onBlur }) => {
  const { hasOfflineBanner } = useNetwork();

  return (
    <Grid item xs={6}>
      <TextField
        size="small"
        id={id}
        name={id}
        label={label}
        error={Boolean(error)}
        helperText={error}
        style={{
          marginTop: '10px',
          marginBottom: error ? '0px' : hasOfflineBanner ? '10px' : '20px',
          width: '110px'
        }}
        className={styles.textField}
        autoComplete="off"
        onBlur={onBlur}
      />
    </Grid>
  );
};
