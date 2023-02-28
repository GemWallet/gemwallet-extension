import { FC, forwardRef, useCallback, useState } from 'react';

import {
  Check as CheckIcon,
  Close as CloseIcon,
  FiberManualRecord as FiberManualRecordIcon
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

import { Network, Networks } from '@gemwallet/constants';

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
}

const NetworkDisplay: FC<NetworkDisplayProps> = ({
  name,
  server,
  description,
  isSelected = false,
  onClick
}) => {
  return (
    <Card
      style={{
        marginBottom: '20px'
      }}
      onClick={onClick}
    >
      <CardActionArea>
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
  const { client, network, connectToNetwork } = useNetwork();
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = useCallback(() => {
    setExplanationOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setExplanationOpen(false);
    setIsLoading(false);
  }, []);

  const handleClickOnNetwork = useCallback(
    async (network: Network) => {
      setIsLoading(true);
      await connectToNetwork(network);
      handleClose();
    },
    [handleClose, connectToNetwork]
  );

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
            {Array.from(Networks, ([key, values]) => {
              const { name, server, description } = values;
              return (
                <NetworkDisplay
                  key={name}
                  name={name}
                  server={server}
                  description={description.toString()}
                  isSelected={name === network}
                  onClick={() => handleClickOnNetwork(name)}
                />
              );
            })}
          </div>
        </Dialog>
      )}
    </>
  );
};
