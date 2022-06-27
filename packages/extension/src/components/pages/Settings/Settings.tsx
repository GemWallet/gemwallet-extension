import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useLedger } from '../../../contexts/LedgerContext';
import { PageWithNavMenu } from '../../templates';
import { openExternalLink } from '../../../utils';
import {
  ABOUT_PATH,
  FAQ_LINK,
  FEEDBACK_LINK,
  NAV_MENU_HEIGHT,
  RESET_PASSWORD_PATH
} from '../../../constants';

const TITLE_HEIGHT = 56;
const CONTAINER_HEIGHT_TAKEN = TITLE_HEIGHT + NAV_MENU_HEIGHT;

export const Settings: FC = () => {
  const navigate = useNavigate();
  const { signOut } = useLedger();

  // TODO: UseCallback - check all the files to add the useCallback :)
  const handleLock = () => {
    signOut();
  };

  const items = useMemo(
    () => [
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
          height: `calc(100vh - ${CONTAINER_HEIGHT_TAKEN}px)`
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
