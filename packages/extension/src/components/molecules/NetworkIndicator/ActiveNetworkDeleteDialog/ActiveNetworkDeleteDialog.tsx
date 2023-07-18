import { FC } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

interface ActiveNetworkDeleteDialogProps {
  activeNetworkDeleteDialogOpen: boolean;
  currentNetworkName: string;
  closeActiveNetworkDeleteDialog: () => void;
}

export const ActiveNetworkDeleteDialog: FC<ActiveNetworkDeleteDialogProps> = ({
  activeNetworkDeleteDialogOpen,
  currentNetworkName,
  closeActiveNetworkDeleteDialog
}) => (
  <Dialog open={activeNetworkDeleteDialogOpen} onClose={closeActiveNetworkDeleteDialog}>
    <DialogTitle>Error</DialogTitle>
    <DialogContent>
      <DialogContentText>
        You are currently connected to the network {currentNetworkName}. Please switch to another
        network before deleting this one.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={closeActiveNetworkDeleteDialog} color="primary" autoFocus>
        OK
      </Button>
    </DialogActions>
  </Dialog>
);
