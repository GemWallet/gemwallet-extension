import { FC, useMemo } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { PageWithSpinner, PageWithTitle } from '../../templates';
import { SECONDARY_GRAY } from '../../../constants';
import { loadTrustedApps, Permission, checkPermissions } from '../../../utils';
import { useLedger } from '../../../contexts';

export interface SharingPageProps {
  title: string;
  permissions: Permission[];
  permissionDetails: string[];
  handleShare: () => void;
  handleReject: () => void;
}

export const SharingPage: FC<SharingPageProps> = ({
  title: titlePage,
  permissions,
  permissionDetails,
  handleShare,
  handleReject
}) => {
  const { selectedWallet } = useLedger();

  const trustedApps = useMemo(() => {
    return loadTrustedApps(selectedWallet);
  }, [selectedWallet]);

  const payload = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return {
      id: Number(urlParams.get('id')) || 0,
      url: urlParams.get('url'),
      title: urlParams.get('title'),
      favicon: urlParams.get('favicon') || undefined
    };
  }, []);

  const { url, title, favicon } = payload;

  const trustedApp = useMemo(() => {
    return trustedApps.filter((trustedApp) => trustedApp.url === url)[0];
  }, [trustedApps, url]);

  if (trustedApp && checkPermissions(trustedApp, permissions)) {
    handleShare();
    return <PageWithSpinner />;
  }

  return (
    <PageWithTitle title={titlePage}>
      <Paper
        elevation={24}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px'
        }}
      >
        <Avatar src={favicon} variant="rounded" />
        <Typography variant="h6">{title}</Typography>
        <Typography style={{ color: SECONDARY_GRAY }}>{url}</Typography>
      </Paper>

      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">This app would like to:</Typography>
        <List>
          {permissionDetails.map((permDetail) => {
            return (
              <ListItem style={{ padding: '0 16px' }} key={permDetail}>
                <CheckIcon color="success" />
                <ListItemText style={{ marginLeft: '10px' }} primary={permDetail} />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      <div style={{ display: 'flex', justifyContent: 'center', color: SECONDARY_GRAY }}>
        <Typography>Only connect to website you trust</Typography>
      </div>

      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="contained" onClick={handleShare}>
          Share
        </Button>
      </Container>
    </PageWithTitle>
  );
};
