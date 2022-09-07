import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider, IconButton, Typography } from '@mui/material';
import { PageWithNavMenu } from '../../templates';
import { loadTrustedApps, removeTrustedApp } from '../../../utils';
import { navigation, NAV_MENU_HEIGHT, SETTINGS_PATH } from '../../../constants';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { TrustedApp } from '../../molecules/TrustedApp';
import { useLedger } from '../../../contexts';

const TITLE_HEIGHT = 56;
const CONTAINER_HEIGHT_TAKEN = TITLE_HEIGHT + NAV_MENU_HEIGHT;

export const TrustedApps: FC = () => {
  const navigate = useNavigate();
  const { selectedWallet } = useLedger();
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
        style={{ height: `calc(100vh - ${CONTAINER_HEIGHT_TAKEN}px)`, padding: '20px 20px 0 20px' }}
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
