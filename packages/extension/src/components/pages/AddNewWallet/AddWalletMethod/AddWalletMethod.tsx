import { FC, useCallback } from 'react';

import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LIST_WALLETS_PATH } from '../../../../constants';
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
    navigate(LIST_WALLETS_PATH);
  }, [navigate]);
  const { t } = useTranslation('common');

  return (
    <PageWithReturn title={t('TEXT_ADD_WALLET')} onBackClick={handleBack}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography style={{ margin: '10px 0 30px 0' }} align="center">
          {t('TEXT_IMPORT_OR_CREATE_WALLET')}
        </Typography>
        <ButtonOption
          name={t('TEXT_CREATE_NEW_WALLET')}
          description={t('TEXT_GENERATE_NEW_WALLET_ADDRESS')}
          onClick={onCreateNewWallet}
        />
        <ButtonOption
          name="Import a new wallet"
          description={t('TEXT_IMPORT_EXISTING_WALLET')}
          onClick={onImportWallet}
        />
      </div>
    </PageWithReturn>
  );
};
