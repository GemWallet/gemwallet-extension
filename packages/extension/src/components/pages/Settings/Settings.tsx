import { FC, useCallback, useMemo } from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  ABOUT_PATH,
  FAQ_LINK,
  FEEDBACK_LINK,
  NAV_MENU_HEIGHT,
  RESET_PASSWORD_PATH,
  TRUSTED_APPS_PATH
} from '../../../constants';
import { useWallet } from '../../../contexts';
import { openExternalLink } from '../../../utils';
import { PageWithNavMenu } from '../../templates';

export const Settings: FC = () => {
  const navigate = useNavigate();
  const { signOut } = useWallet();
  const { t } = useTranslation('common');

  const handleLock = useCallback(() => {
    signOut();
  }, [signOut]);

  const items = useMemo(
    () => [
      {
        name: t('TEXT_TRUSTED_APPS'),
        onClick: () => navigate(TRUSTED_APPS_PATH)
      },
      {
        name: t('TEXT_HELP'),
        onClick: () => openExternalLink(FAQ_LINK)
      },
      {
        name: t('TEXT_LEAVE_FEEDBACK'),
        onClick: () => openExternalLink(FEEDBACK_LINK)
      },
      {
        name: t('TEXT_RESET_PASSWORD'),
        onClick: () => navigate(RESET_PASSWORD_PATH)
      },
      {
        name: t('TEXT_ABOUT'),
        onClick: () => navigate(ABOUT_PATH)
      }
    ],
    [navigate, t]
  );

  return (
    <PageWithNavMenu>
      <div
        style={{
          padding: '0.75rem 1rem'
        }}
      >
        <Typography variant="h6">{t('TEXT_SETTINGS')}</Typography>
      </div>
      <Divider />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: `calc(100% - ${NAV_MENU_HEIGHT}px)`
        }}
      >
        <List>
          {items.map(({ name, onClick }) => (
            <ListItem button key={name} onClick={onClick}>
              <ListItemText primary={name} />
              <ListItemIcon>
                <NavigateNextIcon />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
        <div
          style={{
            margin: '1.5rem'
          }}
        >
          <Button variant="contained" fullWidth size="large" onClick={handleLock}>
            {t('TEXT_LOCK')}
          </Button>
        </div>
      </div>
    </PageWithNavMenu>
  );
};
