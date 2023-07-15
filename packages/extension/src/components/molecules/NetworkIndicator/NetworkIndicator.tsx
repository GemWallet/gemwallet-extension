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
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { NETWORK, Network } from '@gemwallet/constants';

import { SECONDARY_GRAY } from '../../../constants';
import { useNetwork } from '../../../contexts';
import { LoadingOverlay } from '../../templates';

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
  onServerChange: (server: string) => void;
}

const NetworkDisplay: FC<NetworkDisplayProps> = ({
  name,
  server,
  description,
  isSelected = false,
  onClick,
  onServerChange
}) => {
  const [customServer, setCustomServer] = useState(server);

  const handleServerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newServer = event.target.value;
    setCustomServer(newServer);
    onServerChange(newServer);
  };

  const handleCardClick = () => {
    if (name !== Network.CUSTOM || (name === Network.CUSTOM && customServer)) {
      onClick();
    }
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
              {name === Network.CUSTOM ? (
                <TextField
                  value={customServer}
                  onChange={handleServerChange}
                  onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                    event.stopPropagation();
                  }}
                />
              ) : (
                server
              )}
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
  const [customServer, setCustomServer] = useState('');

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

  const handleCustomServerChange = (server: string) => {
    setCustomServer(server);
  };

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
            {Object.keys(NETWORK).map((_network) => {
              const { name, server, description } = NETWORK[_network as Network];
              return (
                <NetworkDisplay
                  key={_network}
                  name={name}
                  server={server}
                  description={description}
                  isSelected={name === network}
                  onClick={() =>
                    handleClickOnNetwork(
                      _network as Network,
                      name === Network.CUSTOM ? customServer : undefined
                    )
                  }
                  onServerChange={handleCustomServerChange}
                />
              );
            })}
          </div>
        </Dialog>
      )}
    </>
  );
};
