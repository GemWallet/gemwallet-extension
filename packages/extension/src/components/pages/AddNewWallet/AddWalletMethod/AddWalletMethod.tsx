import { FC, useCallback } from 'react';

import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { LIST_WALLETS } from '../../../../constants';
import { ButtonOption } from '../../../atoms';
import { PageWithReturn } from '../../../templates';

export interface AddWalletMethodProps {
  onCreateNewWallet: () => void;
  onImportWallet: () => void;
}

export const AddWalletMethod: FC<AddWalletMethodProps> = ({
  onCreateNewWallet,
  onImportWallet
}) => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(LIST_WALLETS);
  }, [navigate]);

  return (
    <PageWithReturn title="Add Wallet" onBackClick={handleBack}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography style={{ margin: '10px 0 30px 0' }} align="center">
          Import an existing wallet or create a new one
        </Typography>
        <ButtonOption
          name="Create a new wallet"
          description="Generate a new wallet address"
          onClick={onCreateNewWallet}
        />
        <ButtonOption
          name="Import a wallet"
          description="Import an existing wallet"
          onClick={onImportWallet}
        />
      </div>
    </PageWithReturn>
  );
};
