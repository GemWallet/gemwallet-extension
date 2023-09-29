import { FC } from 'react';

import { Modal, Box, Typography, DialogActions, Button, DialogTitle } from '@mui/material';

export interface DestinationTagInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export const DestinationTagInfoModal: FC<DestinationTagInfoModalProps> = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        style={{
          width: '300px',
          backgroundColor: '#272727',
          borderRadius: '10px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 'none',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <DialogTitle sx={{ margin: 0, paddingX: 2, paddingBottom: '8px' }}>
          About the Destination Tag
        </DialogTitle>

        <Typography
          style={{
            padding: '20px',
            paddingTop: '5px',
            paddingBottom: '0',
            fontSize: '16px',
            textAlign: 'left'
          }}
        >
          When you're sending funds to an exchange, it is crucial to include a destination tag. A
          destination tag is a numeric value that will associate your transaction with your user
          account on the exchange. Some exchanges call it "memo".
        </Typography>

        <Typography
          style={{
            padding: '20px',
            paddingTop: '16px',
            paddingBottom: '0',
            fontSize: '16px',
            textAlign: 'left'
          }}
        >
          Failing to include a destination tag can result in the loss of your funds, as the exchange
          won't be able to associate the incoming funds with your user account. Always verify the
          destination tag given by the exchange and enter it correctly before confirming the
          transaction.
        </Typography>

        <DialogActions
          style={{
            backgroundColor: '#272727',
            height: '30px',
            paddingTop: '6px'
          }}
        >
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Box>
    </Modal>
  );
};
