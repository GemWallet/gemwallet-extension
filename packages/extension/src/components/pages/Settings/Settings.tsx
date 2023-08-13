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
import { PageWithNavMenu } from '../../templates';

export const Settings: FC = () => {
  const navigate = useNavigate();
  const { signOut } = useWallet();

  const handleLock = useCallback(() => {
    signOut();
  }, [signOut]);

  const items = useMemo(
    () => [
      {
        name: 'Trusted Apps',
        onClick: () => navigate(TRUSTED_APPS_PATH)
      },
      {
        name: 'Permissions',
        onClick: () => navigate(PERMISSIONS_PATH)
      },
      {
        name: 'Help',
        onClick: () => openExternalLink(FAQ_LINK)
      },
      {
        name: 'Leave A Feedback',
        onClick: () => openExternalLink(FEEDBACK_LINK)
      },
      {
        name: 'Reset Password',
        onClick: () => navigate(RESET_PASSWORD_PATH)
      },
      {
        name: 'Delete Account',
        onClick: () => navigate(DELETE_ACCOUNT_PATH)
      },
      {
        name: 'About',
        onClick: () => navigate(ABOUT_PATH)
      }
    ],
    [navigate]
  );

  return (
    <PageWithNavMenu>
      <div
        style={{
          padding: '0.75rem 1rem'
        }}
      >
        <Typography variant="h6">Settings</Typography>
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
            Lock
          </Button>
        </div>
      </div>
    </PageWithNavMenu>
  );
};
