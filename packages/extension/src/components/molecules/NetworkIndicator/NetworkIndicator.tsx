import { FC, forwardRef, useCallback, useState } from 'react';
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
import {
  Close as CloseIcon,
  FiberManualRecord as FiberManualRecordIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { useLedger } from '../../../contexts';
import { NETWORK, SECONDARY_GRAY } from '../../../constants';

const NETWORKS = [
  { name: 'Mainnet', server: NETWORK.MAINNET },
  { name: 'Testnet', server: NETWORK.TESTNET },
  { name: 'Devnet', server: NETWORK.DEVNET }
];

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
  isSelected?: boolean;
  onClick: () => void;
}

const NetworkDisplay: FC<NetworkDisplayProps> = ({ name, server, isSelected = false, onClick }) => {
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
            <Typography variant="body2" color={SECONDARY_GRAY}>
              {server}
            </Typography>
          </Box>
          {isSelected ? <CheckIcon /> : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export const NetworkIndicator: FC = () => {
  const { client } = useLedger();
  const [explanationOpen, setExplanationOpen] = useState(true);

  const handleOpen = useCallback(() => {
    setExplanationOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setExplanationOpen(false);
  }, []);

  const handleClickOnNetwork = useCallback((name: string) => {
    console.log('Select network: ', name);
  }, []);

  return (
    <>
      <Chip
        label="Testnet"
        size="small"
        icon={
          <FiberManualRecordIcon
            style={{
              color: client ? 'green' : 'red'
            }}
          />
        }
        onClick={handleOpen}
      />
      <Dialog
        fullScreen
        open={explanationOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
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
        <div style={{ margin: '20px' }}>
          {NETWORKS.map(({ name, server }) => (
            <NetworkDisplay
              key={name}
              name={name}
              server={server}
              isSelected={name === 'Testnet'}
              onClick={() => handleClickOnNetwork(name)}
            />
          ))}
        </div>
      </Dialog>
    </>
  );
};
