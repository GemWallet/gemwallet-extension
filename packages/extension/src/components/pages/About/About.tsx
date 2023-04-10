import { FC, useCallback } from 'react';

import LinkIcon from '@mui/icons-material/Link';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  ANNOUNCEMENT_LINK,
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

export const About: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  const aboutLinks = [
    {
      name: t('TEXT_WEBSITE'),
      url: GEMWALLET_LINK
    },
    {
      name: t('TEXT_DOCUMENTATION'),
      url: DOCUMENTATION_LINK
    },
    {
      name: t('TEXT_ANNOUNCEMENT'),
      url: ANNOUNCEMENT_LINK
    },
    {
      name: t('TEXT_GITHUB'),
      url: GITHUB_LINK
    },
    {
      name: t('TEXT_FEEDBACK'),
      url: FEEDBACK_LINK
    },
    {
      name: t('TEXT_DISCORD'),
      url: DISCORD_LINK
    }
  ];

  return (
    <PageWithReturn title={t('TEXT_ABOUT')} onBackClick={handleBack}>
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
        {t('TEXT_WHAT_IS_GEMWALLET')}
      </Typography>
      <div style={{ marginTop: '1rem' }}>
        <Typography variant="subtitle2">{t('TEXT_LINKS')}</Typography>
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
