import { FC, useMemo, useState } from 'react';

import { KeyboardArrowLeft } from '@mui/icons-material';
import { Divider, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { navigation, NAV_MENU_HEIGHT, SETTINGS_PATH } from '../../../constants';
import { useWallet } from '../../../contexts';
import { loadTrustedApps, removeTrustedApp } from '../../../utils';
import { TrustedApp } from '../../molecules/TrustedApp';
import { PageWithNavMenu } from '../../templates';

const PADDING = 20;

export const TrustedApps: FC = () => {
  const navigate = useNavigate();
  const { selectedWallet } = useWallet();
  const [trustedApps, setTrustedApps] = useState(loadTrustedApps(selectedWallet));

  const indexDefaultNav = useMemo(
    () => navigation.findIndex((link) => link.pathname === SETTINGS_PATH),
    []
  );

  const onRevokeClick = (url: string) => {
    const newTrustedApps = removeTrustedApp(url, selectedWallet);
    setTrustedApps(newTrustedApps);
  };

  return (
    <PageWithNavMenu indexDefaultNav={indexDefaultNav}>
      <div
        style={{
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <IconButton
          style={{ position: 'fixed', left: 0 }}
          aria-label="close"
          onClick={() => navigate(SETTINGS_PATH)}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Typography variant="h6">Trusted Apps</Typography>
      </div>
      <Divider />
      <div
        style={{
          height: `calc(100% - ${NAV_MENU_HEIGHT}px - ${PADDING}px)`,
          padding: `${PADDING}px ${PADDING}px 0`,
          overflowY: 'scroll'
        }}
      >
        {trustedApps.map(({ url }) => (
          <TrustedApp
            key={url}
            url={url}
            onRevokeClick={onRevokeClick}
            style={{ marginBottom: 20 }}
          />
        ))}
        <div
          style={{
            margin: '1.5rem'
          }}
        ></div>
      </div>
    </PageWithNavMenu>
  );
};
