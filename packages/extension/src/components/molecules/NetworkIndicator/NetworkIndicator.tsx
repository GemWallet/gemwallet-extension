import { FC, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';

import {
  Close as CloseIcon,
  FiberManualRecord as FiberManualRecordIcon
} from '@mui/icons-material';
import {
  AppBar,
  Button,
  Chip,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as Sentry from '@sentry/react';

import { NETWORK, Network } from '@gemwallet/constants';
import { NetworkData } from '@gemwallet/constants/src/network/network.types';

import { useNetwork } from '../../../contexts';
import { loadCustomNetworks, loadNetwork, replaceCustomNetworks } from '../../../utils';
import { LoadingOverlay } from '../../templates';
import { ActiveNetworkDeleteDialog } from './ActiveNetworkDeleteDialog';
import { AddCustomNetworkDialog } from './AddCustomNetworkDialog';
import { DeleteNetworkDialog } from './DeleteNetworkDialog';
import { ErrorSwitchNetworkDialog } from './ErrorSwitchNetworkDialog';
import { NetworkDisplay } from './NetworkDisplay';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const NetworkIndicator: FC = () => {
  const { client, network, switchNetwork } = useNetwork();
  const [currentNetworkName, setCurrentNetworkName] = useState<string>(network as string);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [handleAddNetwork, setHandleAddNetwork] = useState(false);
  const [existingNetworks, setExistingNetworks] = useState<Record<string, NetworkData>>({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [networkToDelete, setNetworkToDelete] = useState<string | null>(null);
  const [activeNetworkDeleteDialogOpen, setActiveNetworkDeleteDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const refreshCustomNetworks = useCallback(() => {
    try {
      const customNetworks = loadCustomNetworks();
      setExistingNetworks(customNetworks);
    } catch (error) {
      Sentry.captureException(error);
    }
  }, []);

  useEffect(() => {
    try {
      refreshCustomNetworks();
    } catch (error) {
      Sentry.captureException(error);
    }
  }, [refreshCustomNetworks]);

  useEffect(() => {
    setCurrentNetworkName(network as string);
  }, [network]);

  const handleOpen = useCallback(() => {
    setExplanationOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setExplanationOpen(false);
    setIsLoading(false);
  }, []);

  const handleClickOnNetwork = useCallback(
    async (network: Network, customNetworkName?: string, customNetworkServer?: string) => {
      setIsLoading(true);
      const currentNetwork = loadNetwork();
      try {
        await switchNetwork(network, customNetworkName, customNetworkServer);
        setCurrentNetworkName(customNetworkName || network);
      } catch (error) {
        // If the network switch fails, reconnect to the previous network
        try {
          await switchNetwork(currentNetwork.name, currentNetwork.name, currentNetwork.server);
          setCurrentNetworkName(currentNetwork.name);
        } catch (error) {}
        // Show the error dialog
        setErrorDialogOpen(true);
      }
      handleClose();
    },
    [handleClose, switchNetwork]
  );

  const handleAddNetworkClick = useCallback(() => {
    setHandleAddNetwork(true);
  }, []);

  const handleAddNetworkClose = useCallback(() => {
    setHandleAddNetwork(false);
  }, []);

  const removeNetwork = useCallback(
    (networkName: string) => {
      // If the network to delete is the active one, show the active network deletion warning dialog
      if (networkName === currentNetworkName) {
        setActiveNetworkDeleteDialogOpen(true);
      } else {
        setNetworkToDelete(networkName);
        setConfirmDeleteOpen(true);
      }
    },
    [currentNetworkName]
  );

  const handleConfirmDelete = useCallback(() => {
    if (networkToDelete) {
      try {
        const updatedNetworks = { ...existingNetworks };
        delete updatedNetworks[networkToDelete];
        replaceCustomNetworks(updatedNetworks);
        setExistingNetworks(updatedNetworks);
      } catch (error) {
        Sentry.captureException(error);
      }
    }

    // close the confirmation dialog
    setConfirmDeleteOpen(false);
  }, [existingNetworks, networkToDelete]);

  const preDefinedNetworks = useMemo(() => {
    return Object.keys(NETWORK)
      .filter((network) => network !== Network.CUSTOM)
      .map((_network) => {
        const { name, server, description } = NETWORK[_network as Network];
        return (
          <NetworkDisplay
            key={_network}
            name={name}
            server={server}
            description={description}
            isSelected={name === currentNetworkName}
            onClick={() => handleClickOnNetwork(_network as Network)}
          />
        );
      });
  }, [currentNetworkName, handleClickOnNetwork]);

  const customNetworks = useMemo(() => {
    return Object.keys(existingNetworks).map((_network) => {
      const { name, server, description } = existingNetworks[_network];
      return (
        <NetworkDisplay
          key={_network}
          name={name}
          server={server}
          description={description || ''}
          isSelected={name === currentNetworkName}
          onClick={() => handleClickOnNetwork(Network.CUSTOM, name, server)}
          onRemove={() => removeNetwork(name)}
        />
      );
    });
  }, [currentNetworkName, existingNetworks, handleClickOnNetwork, removeNetwork]);

  return (
    <>
      <Chip
        label={currentNetworkName || network || 'Switch network'}
        size="small"
        icon={
          <FiberManualRecordIcon
            style={{
              color: client ? 'green' : 'red'
            }}
          />
        }
        onClick={handleOpen}
        data-testid="network-indicator"
      />
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          <ErrorSwitchNetworkDialog
            open={errorDialogOpen}
            onClose={() => setErrorDialogOpen(false)}
          />
          <AddCustomNetworkDialog
            dialogOpen={handleAddNetwork}
            handleClose={handleAddNetworkClose}
            refreshNetworks={refreshCustomNetworks}
            networkNames={[...Object.keys(NETWORK), ...Object.keys(existingNetworks)].map((name) =>
              name.toLowerCase()
            )}
          />
          <DeleteNetworkDialog
            confirmDeleteOpen={confirmDeleteOpen}
            networkToDelete={networkToDelete}
            handleConfirmDelete={handleConfirmDelete}
            closeDeleteDialog={() => setConfirmDeleteOpen(false)}
          />
          <ActiveNetworkDeleteDialog
            activeNetworkDeleteDialogOpen={activeNetworkDeleteDialogOpen}
            currentNetworkName={currentNetworkName}
            closeActiveNetworkDeleteDialog={() => setActiveNetworkDeleteDialogOpen(false)}
          />
          <Dialog
            fullScreen
            open={explanationOpen}
            onClose={handleClose}
            TransitionComponent={Transition}
            data-testid="network-indicator-dialog"
          >
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  Change Network
                </Typography>
              </Toolbar>
            </AppBar>
            <div style={{ overflowY: 'scroll', height: '544px', margin: '20px 20px 0 20px' }}>
              <div style={{ paddingBottom: '40px' }}>
                {preDefinedNetworks}
                {customNetworks}
              </div>
              {
                // Display the custom network input
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleAddNetworkClick}
                    style={{ margin: '10px 0' }}
                  >
                    Add a custom network
                  </Button>
                </div>
              }
            </div>
          </Dialog>
        </>
      )}
    </>
  );
};
