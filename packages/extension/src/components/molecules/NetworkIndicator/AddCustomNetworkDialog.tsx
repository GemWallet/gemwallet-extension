import { FC, FocusEvent, useCallback, useMemo, useState } from 'react';

import { Button, TextField } from '@mui/material';

import { saveCustomNetwork } from '../../../utils';
import { DialogPage } from '../../templates';

interface AddCustomNetworkDialogProps {
  dialogOpen: boolean;
  handleClose: () => void;
  refreshNetworks: () => void;
  networkNames: string[];
}

export const AddCustomNetworkDialog: FC<AddCustomNetworkDialogProps> = ({
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
    <DialogPage title="Add custom network" onClose={handleClose} open={dialogOpen}>
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
    </DialogPage>
  );
};
