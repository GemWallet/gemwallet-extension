import { FC, useCallback } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Button, Typography } from '@mui/material';

import { useWallet } from '../../../../contexts';
import { PageWithReturn } from '../../../templates';

export interface RemoveWalletProps {
  publicAddress: string;
  onBackButton: () => void;
}

export const RemoveWallet: FC<RemoveWalletProps> = ({ publicAddress, onBackButton }) => {
  const { removeWallet } = useWallet();

  const handleRemove = useCallback(() => {
    removeWallet(publicAddress);
    onBackButton();
  }, [onBackButton, publicAddress, removeWallet]);

  return (
    <PageWithReturn title="Remove Wallet" onBackClick={onBackButton}>
      <div
        style={{
          height: '518px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ textAlign: 'center' }}>
            <WarningIcon color="warning" fontSize="large" />
          </div>
          <Typography variant="h5" align="center">
            Are you sure you want to remove your wallet?
          </Typography>
          <Typography align="center" style={{ marginTop: '0.25rem' }}>
            This action will remove your wallet from GemWallet. Make sure that you have your private
            seeds backed up. You can import back this wallet into Gemwallet later on if you want to.
          </Typography>
        </div>
        <div
          style={{
            margin: '1.5rem 0',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Button variant="outlined" size="large" style={{ width: '45%' }} onClick={onBackButton}>
            Cancel
          </Button>
          <Button variant="contained" size="large" style={{ width: '45%' }} onClick={handleRemove}>
            Remove
          </Button>
        </div>
      </div>
    </PageWithReturn>
  );
};
