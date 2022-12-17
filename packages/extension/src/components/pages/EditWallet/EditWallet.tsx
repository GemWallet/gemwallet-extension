import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { LIST_WALLETS } from '../../../constants';
import { useWallet } from '../../../contexts';
import { WalletLedger } from '../../../types';
import { truncateAddress } from '../../../utils';
import { WalletIcon } from '../../atoms';
import { PageWithReturn, PageWithSpinner } from '../../templates';
import { RemoveWallet } from './RemoveWallet';
import { ShowSecret } from './ShowSecret';
import { WalletName } from './WalletName';

type Menu = 'walletName' | 'walletAddress' | 'showSecret' | 'removeWallet';

export const EditWallet: FC = () => {
  const navigate = useNavigate();
  const { publicAddress } = useParams();
  const [wallet, setWallet] = useState<WalletLedger>();
  const [menu, setMenu] = useState<Menu>();

  const { getWalletByPublicAddress } = useWallet();

  const handleBack = useCallback(() => {
    navigate(LIST_WALLETS);
  }, [navigate]);

  useEffect(() => {
    if (publicAddress) {
      const selectedWallet = getWalletByPublicAddress(publicAddress);
      if (selectedWallet) {
        setWallet(getWalletByPublicAddress(publicAddress));
      } else {
        handleBack();
      }
    } else {
      handleBack();
    }
  }, [getWalletByPublicAddress, handleBack, publicAddress]);

  const items = useMemo(
    () => [
      {
        name: 'Wallet Name',
        value: wallet?.name,
        onClick: () => setMenu('walletName')
      },
      {
        name: 'Wallet Address',
        value: truncateAddress(wallet?.publicAddress || ''),
        onClick: () => setMenu('walletAddress')
      },
      {
        name: wallet?.seed ? 'Show your seed' : 'Show your mnemonic',
        onClick: () => setMenu('showSecret')
      }
    ],
    [wallet?.name, wallet?.publicAddress, wallet?.seed]
  );

  if (publicAddress === undefined) {
    handleBack();
    return <PageWithSpinner />;
  }

  if (menu === 'walletName' && wallet !== undefined) {
    return <WalletName wallet={wallet} onBackButton={() => setMenu(undefined)} />;
  }

  if (menu === 'showSecret' && wallet !== undefined) {
    return (
      <ShowSecret
        seed={wallet.seed}
        mnemonic={wallet.mnemonic}
        onBackButton={() => setMenu(undefined)}
      />
    );
  }

  if (menu === 'removeWallet' && wallet !== undefined) {
    return (
      <RemoveWallet publicAddress={wallet.publicAddress} onBackButton={() => setMenu(undefined)} />
    );
  }

  return (
    <PageWithReturn title="Edit wallet" onBackClick={handleBack}>
      {wallet === undefined ? (
        <div
          style={{
            height: '518px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </div>
      ) : (
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
              <WalletIcon publicAddress={publicAddress} size="xl" />
            </div>
            <List>
              {items.map(({ name, value, onClick }) => (
                <ListItem button key={name} onClick={onClick}>
                  <ListItemText primary={name} />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {value ? <ListItemText primary={value} /> : null}
                    <NavigateNextIcon />
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
          <div
            style={{
              margin: '1.5rem 0'
            }}
          >
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => setMenu('removeWallet')}
            >
              Remove Wallet
            </Button>
          </div>
        </div>
      )}
    </PageWithReturn>
  );
};
