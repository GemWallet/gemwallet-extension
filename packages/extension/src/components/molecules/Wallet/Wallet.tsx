import { useState, useEffect, FC, forwardRef, useCallback } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Dialog, IconButton, Link, Slide, Toolbar, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as Sentry from '@sentry/react';

import { Tokens } from '../../../constants';
import { useNetwork, useServer } from '../../../contexts';
import { TokenLoader } from '../../atoms';
import { InformationMessage } from '../InformationMessage';
import { TokenDisplay } from '../TokenDisplay';

const LOADING_STATE = 'Loading...';
const ERROR_STATE = 'Error';

export interface WalletProps {
  address: string;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Wallet: FC<WalletProps> = ({ address }) => {
  const [balance, setBalance] = useState(LOADING_STATE);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const { client } = useNetwork();
  const { serverInfo } = useServer();

  const reserve = serverInfo?.info.validated_ledger?.reserve_base_xrp;

  useEffect(() => {
    async function fetchBalance() {
      try {
        const balance = await client?.getXrpBalance(address);
        if (balance) {
          setBalance(balance);
        }
      } catch (e: any) {
        if (e?.data?.error !== 'actNotFound') {
          Sentry.captureException(e);
        }
        setBalance(ERROR_STATE);
      }
    }

    fetchBalance();
  }, [address, client]);

  const handleOpen = useCallback(() => {
    setExplanationOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setExplanationOpen(false);
  }, []);

  return (
    <>
      {balance === LOADING_STATE || !reserve ? (
        <TokenLoader />
      ) : balance !== ERROR_STATE ? (
        <>
          <TokenDisplay
            balance={Number(balance) - reserve}
            token={Tokens.XRP}
            onExplainClick={handleOpen}
          />
          <Dialog
            fullScreen
            open={explanationOpen}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  Account balance
                </Typography>
              </Toolbar>
            </AppBar>
            <div style={{ margin: '20px' }}>
              <InformationMessage
                title="Information"
                style={{
                  padding: '15px'
                }}
              >
                <Typography style={{ marginBottom: '5px' }}>
                  To create this account to the XRP ledger, you will have to make a first deposit of
                  a minimum 10 XRP.
                </Typography>
                <Link
                  href="https://xrpl.org/reserves.html?utm_source=gemwallet.app"
                  target="_blank"
                  rel="noreferrer"
                >
                  Learn more about the account reserve.
                </Link>
              </InformationMessage>
              <Typography style={{ margin: '20px 0 10px 0' }}>Account balance</Typography>
              <TokenDisplay balance={Number(balance)} token={Tokens.XRP} />
              <Typography style={{ margin: '20px 0 10px 0' }}>Amount that can be spent</Typography>
              <TokenDisplay balance={Number(balance) - reserve} token={Tokens.XRP} />
            </div>
          </Dialog>
        </>
      ) : (
        <InformationMessage title="Account not activated">
          <div style={{ marginBottom: '5px' }}>
            To create this account to the XRP ledger, you will have to make a first deposit of a
            minimum 10 XRP.
          </div>
          <Link
            href="https://xrpl.org/reserves.html?utm_source=gemwallet.app"
            target="_blank"
            rel="noreferrer"
          >
            Learn more about the account reserve.
          </Link>
          <div style={{ marginTop: '5px' }}>
            Your reserved XRP will not show up within your GemWallet's balance as you cannot spend
            it.
          </div>
        </InformationMessage>
      )}
    </>
  );
};
