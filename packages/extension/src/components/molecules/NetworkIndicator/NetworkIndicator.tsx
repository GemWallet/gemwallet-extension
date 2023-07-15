import { FC, forwardRef, useCallback, useState } from 'react';

import {
  Close as CloseIcon,
  FiberManualRecord as FiberManualRecordIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import {
  AppBar,
  Box,
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

import { NETWORK, Network } from '@gemwallet/constants';

import { SECONDARY_GRAY } from '../../../constants';
import { useNetwork } from '../../../contexts';
import { loadCustomNetworks } from '../../../utils';
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
}

const NetworkDisplay: FC<NetworkDisplayProps> = ({
  name,
  server,
  description,
  isSelected = false,
  onClick
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
          {isSelected ? <CheckIcon /> : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export const NetworkIndicator: FC = () => {
  const { client, network, switchNetwork } = useNetwork();
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [handleAddNetwork, setHandleAddNetwork] = useState(false);
  const existingNetworks = loadCustomNetworks();

  const handleOpen = useCallback(() => {
    setExplanationOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setExplanationOpen(false);
    setIsLoading(false);
  }, []);

  const handleClickOnNetwork = useCallback(
    async (network: Network, customServer?: string) => {
      setIsLoading(true);
      await switchNetwork(network, customServer);
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

  return (
    <>
      <Chip
        label={network || 'Switch network'}
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
          <AddCustomNetwork dialogOpen={handleAddNetwork} handleClose={handleAddNetworkClose} />
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
                        isSelected={name === network}
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
                      isSelected={name === network}
                      onClick={() => handleClickOnNetwork(Network.CUSTOM, server)}
                    />
                  );
                })
              }
              {
                // Display the custom network input
                <Card
                  style={{
                    marginBottom: '20px'
                  }}
                >
                  <CardActionArea onClick={handleAddNetworkClick}>
                    <CardContent
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box>
                        <Typography gutterBottom>Custom network</Typography>
                        <Typography
                          style={{ marginTop: '10px' }}
                          variant="body2"
                          color={SECONDARY_GRAY}
                        >
                          Add a custom network
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              }
            </div>
          </Dialog>
        </>
      )}
    </>
  );
};
