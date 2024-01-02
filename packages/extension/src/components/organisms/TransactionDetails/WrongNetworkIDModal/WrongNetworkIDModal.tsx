import { FC, useCallback, useState } from 'react';

import {
  Dialog,
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';

import { NetworkNode } from '@gemwallet/constants';

import { useNetwork } from '../../../../contexts';

export interface WrongNetworkIDModalProps {
  open: boolean;
  onClose: () => void;
  expectedNetwork: NetworkNode | null;
  currentNetwork: NetworkNode;
  setIsLoading: (_: boolean) => void;
}

export const WrongNetworkIDModal: FC<WrongNetworkIDModalProps> = ({
  open,
  onClose,
  expectedNetwork,
  currentNetwork,
  setIsLoading
}) => {
  const { switchNetwork } = useNetwork();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const displayNetwork = useCallback((network: NetworkNode) => {
    return `${network.chain} ${network.name} (Network ID: ${network.networkID})`;
  }, []);

  const onApprove = useCallback(async () => {
    setIsLoading(true);
    if (expectedNetwork?.networkID && expectedNetwork?.networkID !== currentNetwork.networkID) {
      const newChain =
        expectedNetwork?.chain && expectedNetwork?.chain !== currentNetwork.chain
          ? expectedNetwork.chain
          : undefined;
      await switchNetwork({ network: expectedNetwork.name, chain: newChain });
    }

    setShowConfirmation(true);
    setIsLoading(false);
  }, [
    currentNetwork.chain,
    currentNetwork.networkID,
    expectedNetwork?.chain,
    expectedNetwork?.name,
    expectedNetwork?.networkID,
    setIsLoading,
    switchNetwork
  ]);

  if (!expectedNetwork) {
    return null;
  }

  const InitialContent = () => {
    return (
      <>
        <DialogTitle>Wrong Network detected</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are currently connected to <b>{displayNetwork(currentNetwork)}</b>, but the
            transaction is intended for <b>{displayNetwork(expectedNetwork)}</b>.
          </DialogContentText>
          <DialogContentText style={{ paddingTop: '16px' }}>
            Do you want to switch to <b>{displayNetwork(expectedNetwork)}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            No
          </Button>
          <Button onClick={onApprove} color="primary">
            Yes
          </Button>
        </DialogActions>
      </>
    );
  };

  const ConfirmationContent = () => {
    return (
      <>
        <DialogTitle>Network switched</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are now connected to ${displayNetwork(expectedNetwork)}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} scroll="paper">
      {showConfirmation ? <ConfirmationContent /> : <InitialContent />}
    </Dialog>
  );
};
