import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface ErrorSwitchDialogNetworkProps {
  open: boolean;
  onClose: () => void;
}

export const ErrorSwitchNetworkDialog: React.FC<ErrorSwitchDialogNetworkProps> = ({
  open,
  onClose
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{'Failed to Switch Network'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You've been automatically reconnected to the previous one.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
