import { FC } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { PageWithReturn } from '../../templates';
import { openExternalLink } from '../../../utils';
import {
  ANNOUNCEMENT_LINK,
  DISCORD_LINK,
  DOCUMENTATION_LINK,
  FEEDBACK_LINK,
  GEMWALLET_LINK,
  GITHUB_LINK
} from '../../../constants/links';
import { Logo } from '../../atoms/Logo';

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
    name: 'GemWallet Announcement',
    url: ANNOUNCEMENT_LINK
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

type PropType = {
  handleBack: () => void;
};

export const AboutPage: FC<PropType> = ({ handleBack }) => {
  return (
    <PageWithReturn title="About" handleBack={handleBack}>
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
        GemWallet is a web extension that allows you to make online payments with one click on the
        XRPL. Our vision is oriented toward payments, micro-payments and payment streaming.
      </Typography>
      <div style={{ marginTop: '1rem' }}>
        <Typography variant="subtitle2">Links</Typography>
        <List>
          {aboutLinks.map(({ name, url }) => (
            <ListItem button key={name} onClick={() => openExternalLink(url)}>
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </div>
    </PageWithReturn>
  );
};
