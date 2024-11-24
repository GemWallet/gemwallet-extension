import { Grid, TextField } from '@mui/material';
import { FC, FocusEvent } from 'react';
import styles from './styles.module.css';

export interface SecretNumberInputProps {
  id: string;
  label: string;
  error: string;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}

export const SecretNumberInput: FC<SecretNumberInputProps> = ({ id, label, error, onBlur }) => (
  <Grid item xs={6}>
    <TextField
      size="small"
      id={id}
      name={id}
      label={label}
      error={Boolean(error)}
      helperText={error}
      style={{
        marginTop: '15px',
        marginBottom: error ? '0px' : '20px',
        width: '110px'
      }}
      className={styles.textField}
      autoComplete="off"
      onBlur={onBlur}
    />
  </Grid>
);
