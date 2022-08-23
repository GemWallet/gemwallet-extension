import { FC, useCallback, useMemo } from 'react';
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
import { saveTrustedApp, loadTrustedApps } from '../../../utils';
import { GEM_WALLET, Message } from '@gemwallet/api/src';
import { useBrowser, useLedger } from '../../../contexts';

export const SharePublicAddress: FC = () => {
  const { getCurrentWallet, selectedWallet } = useLedger();
  const { window: extensionWindow, closeExtension } = useBrowser();

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

  const { id, url, title, favicon } = payload;

  const handleReject = useCallback(() => {
    chrome.runtime
      .sendMessage({
        app: GEM_WALLET,
        type: Message.ReceivePublicAddress,
        payload: {
          id,
          publicAddress: null
        }
      })
      .then(() => {
        if (extensionWindow?.id) {
          closeExtension({ windowId: Number(extensionWindow.id) });
        }
      });
  }, [closeExtension, extensionWindow?.id, id]);

  const handleShare = useCallback(() => {
    saveTrustedApp({ url: String(url) }, selectedWallet);
    const currentWallet = getCurrentWallet();
    chrome.runtime
      .sendMessage({
        app: GEM_WALLET,
        type: Message.ReceivePublicAddress,
        payload: {
          id,
          publicAddress: currentWallet?.publicAddress
        }
      })
      .then(() => {
        if (extensionWindow?.id) {
          closeExtension({ windowId: Number(extensionWindow.id) });
        }
      });
  }, [closeExtension, extensionWindow?.id, getCurrentWallet, id, selectedWallet, url]);

  if (trustedApps.length) {
    handleShare();
    return <PageWithSpinner />;
  }

  return (
    <PageWithTitle title="Share public key">
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
          <ListItem>
            <CheckIcon color="success" />
            <ListItemText style={{ marginLeft: '10px' }} primary="View your public key" />
          </ListItem>
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
