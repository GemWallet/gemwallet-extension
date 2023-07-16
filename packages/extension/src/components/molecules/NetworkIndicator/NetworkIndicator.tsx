import { FC, forwardRef, useCallback, useEffect, useState } from 'react';

import {
  Close as CloseIcon,
  FiberManualRecord as FiberManualRecordIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
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

import { SECONDARY_GRAY } from '../../../constants';
import { useNetwork } from '../../../contexts';
import { loadCustomNetworks, replaceCustomNetworks } from '../../../utils';
import { LoadingOverlay } from '../../templates';
import { AddCustomNetwork } from './AddCustomNetwork';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface NetworkDisplayProps {
  name: string;
  server: string;
  description: string;
  isSelected?: boolean;
  onClick: () => void;
  onRemove?: () => void;
}

const NetworkDisplay: FC<NetworkDisplayProps> = ({
  name,
  server,
  description,
  isSelected = false,
  onClick,
  onRemove
}) => {
  const handleCardClick = () => {
    onClick();
  };

  return (
    <Card
      style={{
        marginBottom: '20px'
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardContent
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box>
            <Typography gutterBottom>{name}</Typography>
            <Typography variant="subtitle2" color={SECONDARY_GRAY}>
              {server}
            </Typography>
            <Typography style={{ marginTop: '10px' }} variant="body2" color={SECONDARY_GRAY}>
              {description}
            </Typography>
          </Box>
          <Box>
            {onRemove && (
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove();
                }}
                style={{ cursor: 'pointer' }}
              >
                <DeleteIcon />
              </div>
            )}
          </Box>
          {isSelected ? (
            <Box>
              <CheckIcon />
            </Box>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export const NetworkIndicator: FC = () => {
  const { client, network, switchNetwork } = useNetwork();
  const [currentNetworkName, setCurrentNetworkName] = useState<string>(network as string);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [handleAddNetwork, setHandleAddNetwork] = useState(false);
  const [existingNetworks, setExistingNetworks] = useState<
    Record<string, { name: string; server: string; description?: string }>
  >({});

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
      await switchNetwork(network, customNetworkName, customNetworkServer);
      setCurrentNetworkName(customNetworkName || network);
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
      try {
        const updatedNetworks = { ...existingNetworks };
        delete updatedNetworks[networkName];
        replaceCustomNetworks(updatedNetworks);
        setExistingNetworks(updatedNetworks);
      } catch (error) {
        Sentry.captureException(error);
      }
    },
    [existingNetworks]
  );

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
          <AddCustomNetwork
            dialogOpen={handleAddNetwork}
            handleClose={handleAddNetworkClose}
            refreshNetworks={refreshCustomNetworks}
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
                {
                  // Display all the pre-defined networks
                  Object.keys(NETWORK)
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
                    })
                }
                {
                  // Display the custom networks of the user
                  Object.keys(existingNetworks).map((_network) => {
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
                  })
                }
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
                    // backgroundColor: '#383838'
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
