import { FC } from 'react';

import {
  Dialog,
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';

export interface DestinationTagInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export const DestinationTagInfoModal: FC<DestinationTagInfoModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} scroll="paper">
      <DialogTitle>About the Destination Tag</DialogTitle>
      <DialogContent>
        <DialogContentText>
          When you're sending funds to an exchange, it is crucial to include a destination tag. A
          destination tag is a numeric value that will associate your transaction with your user
          account on the exchange. Some exchanges call it "memo".
        </DialogContentText>
        <DialogContentText>
          Failing to include a destination tag can result in the loss of your funds, as the exchange
          won't be able to associate the incoming funds with your user account. Always verify the
          destination tag given by the exchange and enter it correctly before confirming the
          transaction.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
