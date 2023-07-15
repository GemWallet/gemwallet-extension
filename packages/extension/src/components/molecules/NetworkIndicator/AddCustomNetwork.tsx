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
}

export const AddCustomNetwork: FC<AddCustomNetworkProps> = ({
  dialogOpen,
  handleClose,
  refreshNetworks
}) => {
  const [networkName, setNetworkName] = useState<string>('');
  const [server, setServer] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');

  const handleNetworkNameChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setNetworkName(e.target.value);
  }, []);

  const handleServerChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setServer(e.target.value);

    if (!e.target.value.startsWith('wss://')) {
      setServerError('Server must start with wss://');
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
    return !!(networkName === '' || server === '' || serverError);
  }, [networkName, server, serverError]);

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
          fullWidth
          style={{ marginTop: '5px', marginBottom: '10px' }}
        />
        <TextField
          label="Server (starting with wss://)"
          id="server"
          name="server"
          onChange={handleServerChange}
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
