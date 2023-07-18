import { FC } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

interface DeleteNetworkDialogProps {
  confirmDeleteOpen: boolean;
  networkToDelete: string | null;
  handleConfirmDelete: () => void;
  closeDeleteDialog: () => void;
}

export const DeleteNetworkDialog: FC<DeleteNetworkDialogProps> = ({
  confirmDeleteOpen,
  networkToDelete,
  handleConfirmDelete,
  closeDeleteDialog
}) => (
  <Dialog open={confirmDeleteOpen} onClose={closeDeleteDialog}>
    <DialogTitle>Are you sure?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete the network {networkToDelete}?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={closeDeleteDialog} color="primary">
        Cancel
      </Button>
      <Button onClick={handleConfirmDelete} color="primary" autoFocus>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);
