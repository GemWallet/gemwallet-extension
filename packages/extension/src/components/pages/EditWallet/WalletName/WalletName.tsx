import { ChangeEvent, FC, useCallback, useRef, useState } from 'react';

import { Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useWallet } from '../../../../contexts';
import { WalletLedger } from '../../../../types';
import { WalletIcon } from '../../../atoms';
import { PageWithReturn } from '../../../templates';

export interface WalletNameProps {
  wallet: WalletLedger;
  onBackButton: () => void;
}

export const WalletName: FC<WalletNameProps> = ({ wallet, onBackButton }) => {
  const { renameWallet } = useWallet();
  const textRef = useRef<HTMLInputElement>(null);
  const [isNameDifferent, setIsNameDifferent] = useState<boolean>(false);
  const { t } = useTranslation('common');

  const handleChangeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.trim() !== wallet.name && event.target.value.trim() !== '') {
        setIsNameDifferent(true);
      } else {
        setIsNameDifferent(false);
      }
    },
    [wallet.name]
  );

  const handleSave = useCallback(() => {
    renameWallet(textRef.current?.value || wallet.name, wallet.publicAddress);
    onBackButton();
  }, [onBackButton, renameWallet, wallet.name, wallet.publicAddress]);

  return (
    <PageWithReturn title="Wallet Name" onBackClick={onBackButton}>
      <div
        style={{
          height: '518px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <WalletIcon publicAddress={wallet.publicAddress} size="xl" />
          </div>
          <Typography align="center" variant="h5">
            {t('TEXT_WALLET_NAME')}
          </Typography>
          <TextField
            inputRef={textRef}
            id="walletName"
            name="walletName"
            label={t('TEXT_NAME')}
            fullWidth
            style={{
              marginTop: '40px'
            }}
            autoComplete="off"
            defaultValue={wallet.name}
            onChange={handleChangeName}
          />
        </div>
        <div
          style={{
            margin: '1.5rem 0',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Button variant="outlined" size="large" style={{ width: '45%' }} onClick={onBackButton}>
            {t('TEXT_CANCEL')}
          </Button>
          <Button
            variant="contained"
            size="large"
            style={{ width: '45%' }}
            disabled={!isNameDifferent}
            onClick={handleSave}
          >
            {t('TEXT_SAVE')}
          </Button>
        </div>
      </div>
    </PageWithReturn>
  );
};
