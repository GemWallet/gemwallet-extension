import { FC } from 'react';

import {
  Button,
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalNumberOfTransactions: number;
}

const Dialog = styled(MuiDialog)(() => ({
  '.MuiDialog-paper': {
    borderRadius: '8px'
  }
}));

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  totalNumberOfTransactions
}) => {
  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Submit all transactions'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You are about to submit {totalNumberOfTransactions} transactions at once.
        </DialogContentText>
        <DialogContentText id="alert-dialog-description" style={{ marginTop: '1rem' }}>
          Are you sure?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
