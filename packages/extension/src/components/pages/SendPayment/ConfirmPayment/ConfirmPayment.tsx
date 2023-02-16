import { FC, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { xrpToDrops } from 'xrpl';

import { ERROR_RED } from '../../../../constants';
import { useLedger, useWallet } from '../../../../contexts';
import { formatToken } from '../../../../utils';
import { TileLoader } from '../../../atoms';
import { PageWithHeader } from '../../../templates';

const DEFAULT_FEES = 'Loading ...';

export interface ConfirmPaymentProps {}

export const ConfirmPayment: FC<ConfirmPaymentProps> = () => {
  const { getCurrentWallet } = useWallet();
  const { estimateNetworkFees } = useLedger();
  const [fees, setFees] = useState<string>('');
  const [errorFees, setErrorFees] = useState<string>('');
  const wallet = getCurrentWallet();

  const currency = undefined;
  const amount = 11.2;
  const destination = 'rKpvvMsdDKEQn12WyKWsyCjmrUXgm2mjZD';

  useEffect(() => {
    if (wallet) {
      // TODO: Handle payment for the trustlines as well
      estimateNetworkFees({
        TransactionType: 'Payment',
        Account: wallet.publicAddress,
        Amount: xrpToDrops(amount),
        Destination: destination
      })
        .then((fees) => {
          setFees(fees);
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
    }
  }, [estimateNetworkFees, getCurrentWallet, wallet]);

  return (
    <PageWithHeader title="Send Payment" disableSendButton>
      <div>
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1">From:</Typography>
          <Typography variant="body2">{wallet?.name}</Typography>
          {/* <Typography variant="body2">{wallet.}</Typography> */}
        </Paper>
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1">Destination:</Typography>
          <Typography variant="body2">{destination}</Typography>
        </Paper>
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1">Amount:</Typography>
          <Typography variant="h6" component="h1" gutterBottom align="right">
            {formatToken(Number(amount), currency || 'XRP')}
          </Typography>
        </Paper>
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="These are the fees to make the transaction over the network">
              <IconButton size="small">
                <ErrorIcon />
              </IconButton>
            </Tooltip>
            Network fees:
          </Typography>
          <Typography variant="body2" gutterBottom align="right">
            {errorFees ? (
              <Typography variant="caption" style={{ color: ERROR_RED }}>
                {errorFees}
              </Typography>
            ) : fees === DEFAULT_FEES ? (
              <TileLoader secondLineOnly />
            ) : (
              formatToken(Number(fees), 'XRP')
            )}
          </Typography>
        </Paper>
        <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button variant="contained" color="secondary" onClick={() => {}}>
            Reject
          </Button>
          <Button variant="contained" onClick={() => {}} disabled={!true}>
            Confirm
          </Button>
        </Container>
      </div>
    </PageWithHeader>
  );
};
