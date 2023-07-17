import { FC, FocusEvent, forwardRef, useCallback, useMemo, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Slide,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { saveCustomNetwork } from '../../../utils';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AddCustomNetworkProps {
  dialogOpen: boolean;
  handleClose: () => void;
  refreshNetworks: () => void;
  networkNames: string[];
}

export const AddCustomNetwork: FC<AddCustomNetworkProps> = ({
  dialogOpen,
  handleClose,
  refreshNetworks,
  networkNames
}) => {
  const [networkName, setNetworkName] = useState<string>('');
  const [server, setServer] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [networkNameError, setNetworkNameError] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');

  const handleNetworkNameChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setNetworkName(e.target.value);

      if (networkNames.includes(e.target.value.toLowerCase())) {
        setNetworkNameError('A network with this name already exists');
      } else if (e.target.value.trim() === '') {
        setNetworkNameError('The network name cannot be empty');
      } else {
        setNetworkNameError('');
      }
    },
    [networkNames]
  );

  const handleServerChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setServer(e.target.value);

    if (!e.target.value.startsWith('wss://')) {
      setServerError('The server must be a valid WebSocket URL (start with wss://)');
    } else {
      setServerError('');
    }
  }, []);

  const handleDescriptionChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleAddNetwork = useCallback(() => {
    saveCustomNetwork({
      name: networkName,
      server,
      description
    });
    refreshNetworks();
    handleClose();
  }, [description, handleClose, networkName, refreshNetworks, server]);

  const isAddNetworkDisabled = useMemo(() => {
    if (networkNames.includes(networkName.toLowerCase())) {
      return true;
    }

    return !!(networkName === '' || server === '' || serverError);
  }, [networkName, networkNames, server, serverError]);

  return (
    <Dialog fullScreen open={dialogOpen} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Add custom network
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ margin: '20px' }}>
        <TextField
          label="Network Name"
          id="network-name"
          name="network-name"
          onChange={handleNetworkNameChange}
          error={!!networkNameError}
          helperText={networkNameError}
          fullWidth
          style={{ marginTop: '5px', marginBottom: '10px' }}
        />
        <TextField
          label="Server (starting with wss://)"
          id="server"
          name="server"
          onChange={handleServerChange}
          error={!!serverError}
          helperText={serverError}
          fullWidth
          style={{ marginTop: '20px', marginBottom: '10px' }}
        />
        <TextField
          label="Description (optional)"
          id="description"
          name="description"
          onChange={handleDescriptionChange}
          fullWidth
          style={{ marginTop: '20px', marginBottom: '10px' }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleAddNetwork}
          disabled={isAddNetworkDisabled}
          style={{ marginTop: '20px', marginBottom: '10px' }}
        >
          Add network
        </Button>
      </div>
    </Dialog>
  );
};
