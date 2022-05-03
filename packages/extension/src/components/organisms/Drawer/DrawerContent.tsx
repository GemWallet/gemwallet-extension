import { FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { openExternalLink } from '../../../utils';
import { FAQ_LINK, FEEDBACK_LINK } from '../../../constants/links';

type PropType = {
  handleResetSecretPhrase: () => void;
  handleAbout: () => void;
  handleClose: () => void;
  handleLock: () => void;
};

export const DrawerContent: FC<PropType> = ({
  handleResetSecretPhrase,
  handleAbout,
  handleClose,
  handleLock
}) => {
  const items = [
    {
      name: 'Help',
      onClick: () => openExternalLink(FAQ_LINK)
    },
    {
      name: 'Leave A Feedback',
      onClick: () => openExternalLink(FEEDBACK_LINK)
    },
    {
      name: 'Reset Secret Phrase',
      onClick: handleResetSecretPhrase
    },
    {
      name: 'About',
      onClick: handleAbout
    }
  ];

  return (
    <>
      <div
        style={{
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6">Settings</Typography>
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <Divider />
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
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          margin: '1.5rem'
        }}
      >
        <Button variant="contained" fullWidth size="large" onClick={handleLock}>
          Lock
        </Button>
      </div>
    </>
  );
};
