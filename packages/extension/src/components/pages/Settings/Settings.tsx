import { FC, useCallback, useMemo } from 'react';

import LockIcon from '@mui/icons-material/Lock';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  ABOUT_PATH,
  DELETE_ACCOUNT_PATH,
  FAQ_LINK,
  FEEDBACK_LINK,
  NAV_MENU_HEIGHT,
  PERMISSIONS_PATH,
  RESET_PASSWORD_PATH,
  TRUSTED_APPS_PATH
} from '../../../constants';
import { useWallet } from '../../../contexts';
import { openExternalLink } from '../../../utils';
import { PageWithHeader } from '../../templates';
import { ItemMenuGroup, MenuGroup } from './MenuGroup';

export const Settings: FC = () => {
  const navigate = useNavigate();
  const { signOut } = useWallet();

  const handleLock = useCallback(() => {
    signOut();
  }, [signOut]);

  const accountParamsItems = useMemo<ItemMenuGroup[]>(
    () => [
      {
        name: 'Trusted Apps',
        type: 'button',
        onClick: () => navigate(TRUSTED_APPS_PATH)
      },
      {
        name: 'Permissions',
        type: 'button',
        onClick: () => navigate(PERMISSIONS_PATH)
      }
    ],
    [navigate]
  );

  const infoItems = useMemo<ItemMenuGroup[]>(
    () => [
      {
        name: 'Help',
        type: 'link',
        onClick: () => openExternalLink(FAQ_LINK)
      },
      {
        name: 'Leave A Feedback',
        type: 'link',
        onClick: () => openExternalLink(FEEDBACK_LINK)
      },
      {
        name: 'About',
        type: 'link',
        onClick: () => navigate(ABOUT_PATH)
      }
    ],
    [navigate]
  );

  const dangerZoneItems = useMemo<ItemMenuGroup[]>(
    () => [
      {
        name: 'Reset Password',
        type: 'button',
        onClick: () => navigate(RESET_PASSWORD_PATH)
      },
      {
        name: 'Delete Account',
        type: 'button',
        onClick: () => navigate(DELETE_ACCOUNT_PATH)
      }
    ],
    [navigate]
  );

  return (
    <PageWithHeader>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: `calc(100% - ${NAV_MENU_HEIGHT}px)`
        }}
      >
        <div style={{ paddingBottom: '0.75rem' }}>
          <MenuGroup sectionName={'Account settings'} items={accountParamsItems} />
          <MenuGroup sectionName={'Informations'} items={infoItems} />
          <MenuGroup sectionName={'Danger zone'} items={dangerZoneItems} />
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<LockIcon />}
            onClick={handleLock}
          >
            Lock wallet
          </Button>
        </div>
      </div>
    </PageWithHeader>
  );
};
