import { FC, useState, useCallback, FocusEvent, useMemo } from 'react';

import { Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isValidAddress } from 'xrpl';

import { SETTINGS_PATH } from '../../../constants';
import { useWallet } from '../../../contexts';
import { PageWithReturn } from '../../templates';

interface DeleteAccountFormProps {
  address: string;
  setAddress: (address: string) => void;
  onConfirm: () => void;
}

export const DeleteAccountForm: FC<DeleteAccountFormProps> = ({
  address,
  setAddress,
  onConfirm
}) => {
  const { getCurrentWallet } = useWallet();

  const navigate = useNavigate();

  const [errorAddress, setErrorAddress] = useState<string>('');

  const handleAddressChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setErrorAddress('');
      setAddress(e.target.value);
    },
    [setAddress]
  );

  const handleAddressBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const currentWallet = getCurrentWallet();
      if (e.target.value === currentWallet?.publicAddress) {
        setErrorAddress('You cannot use the current address as the destination address');
      } else if (e.target.value !== '') {
        setErrorAddress(
          !isValidAddress(e.target.value) ? 'Your destination address is invalid' : ''
        );
      }
    },
    [getCurrentWallet]
  );

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  const isConfirmDisabled = useMemo(() => {
    return !(isValidAddress(address) && errorAddress === '');
  }, [address, errorAddress]);

  return (
    <PageWithReturn title="Delete Account" onBackClick={handleBack}>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: '1rem',
          marginBottom: '3rem'
        }}
      >
        <Typography variant="h5" align="center" style={{ marginTop: '1rem' }}>
          Enter the destination XRPL address to receive your remaining XRP funds
        </Typography>
        <TextField
          label="Destination XRPL address"
          id="destination-address"
          name="destination-address"
          fullWidth
          style={{ marginTop: '3rem' }}
          error={!!errorAddress}
          helperText={errorAddress}
          onChange={handleAddressChange}
          autoComplete="off"
          onBlur={handleAddressBlur}
        />
        <Typography align="center" style={{ marginTop: '3rem' }}>
          In the next step, you will see a confirmation screen and will be able to confirm the
          deletion transaction.
        </Typography>
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          margin: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Button variant="contained" size="large" onClick={handleBack}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={onConfirm}
          color="error"
          disabled={isConfirmDisabled}
        >
          Continue
        </Button>
      </div>
    </PageWithReturn>
  );
};
