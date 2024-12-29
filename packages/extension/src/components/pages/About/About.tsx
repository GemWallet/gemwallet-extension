import { FC, useCallback } from 'react';

import LinkIcon from '@mui/icons-material/Link';
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  DISCORD_LINK,
  DOCUMENTATION_LINK,
  FEEDBACK_LINK,
  GEMWALLET_LINK,
  GITHUB_LINK,
  SETTINGS_PATH
} from '../../../constants';
import { openExternalLink } from '../../../utils';
import { Logo } from '../../atoms/Logo';
import { PageWithReturn } from '../../templates';

const aboutLinks = [
  {
    name: 'GemWallet Website',
    url: GEMWALLET_LINK
  },
  {
    name: 'GemWallet Documentation',
    url: DOCUMENTATION_LINK
  },
  {
    name: 'GemWallet GitHub',
    url: GITHUB_LINK
  },
  {
    name: 'GemWallet Feedback',
    url: FEEDBACK_LINK
  },
  {
    name: 'GemWallet Discord',
    url: DISCORD_LINK
  }
];

export const About: FC = () => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  return (
    <PageWithReturn title="About" onBackClick={handleBack}>
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          marginRight: '20px'
        }}
      >
        <Logo />
        <Typography variant="h5" style={{ marginTop: '0.25rem', marginLeft: '0.75rem' }}>
          GemWallet
        </Typography>
      </div>
      <Typography style={{ marginTop: '0.25rem' }}>
        GemWallet takes you into the world of the XRP Ledger. As a fully decentralized,
        browser-based extension, GemWallet ensures fast transactions and seamless interaction with
        Web3 applications.
      </Typography>
      <div style={{ marginTop: '1rem' }}>
        <Typography variant="subtitle2">Links</Typography>
        <List>
          {aboutLinks.map(({ name, url }) => (
            <ListItemButton key={name} onClick={() => openExternalLink(url)}>
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
          ))}
        </List>
      </div>
    </PageWithReturn>
  );
};
