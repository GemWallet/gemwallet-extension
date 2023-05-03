import { useState, useEffect, FC, forwardRef, useCallback } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Link,
  Slide,
  Toolbar,
  Typography
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';

import { Network } from '@gemwallet/constants';

import { ADD_NEW_TRUSTLINE_PATH, DEFAULT_RESERVE, ERROR_RED } from '../../../constants';
import { useLedger, useNetwork, useServer } from '../../../contexts';
import { convertCurrencyString } from '../../../utils';
import { TokenLoader } from '../../atoms';
import { InformationMessage } from '../../molecules/InformationMessage';
import { TokenDisplay } from '../../molecules/TokenDisplay';

const LOADING_STATE = 'Loading...';
const ERROR_STATE = 'Error';

interface TrustLineBalance {
  value: string;
  currency: string;
  issuer: string;
}
export interface TokenListingProps {
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

export const TokenListing: FC<TokenListingProps> = ({ address }) => {
  const [XRPBalance, setXRPBalance] = useState<string>(LOADING_STATE);
  const [errorMessage, setErrorMessage] = useState('');
  const [trustLineBalances, setTrustLineBalances] = useState<TrustLineBalance[]>([]);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const { client, reconnectToNetwork, network } = useNetwork();
  const { serverInfo } = useServer();
  const { fundWallet } = useLedger();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBalance() {
      try {
        const balances = await client?.getBalances(address);
        const XRPBalance = balances?.find((balance) => balance.issuer === undefined);
        const trustLineBalances = balances?.filter(
          (balance) => balance.issuer !== undefined
        ) as TrustLineBalance[];
        if (XRPBalance) {
          setXRPBalance(XRPBalance.value);
        }
        if (trustLineBalances) {
          setTrustLineBalances(trustLineBalances);
        }
      } catch (e: any) {
        if (e?.data?.error !== 'actNotFound') {
          Sentry.captureException(e);
        }
        setXRPBalance(ERROR_STATE);
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

  const handleFundWallet = useCallback(() => {
    setErrorMessage('');
    setXRPBalance(LOADING_STATE);
    fundWallet()
      .then(({ balance }) => setXRPBalance(balance.toString()))
      .catch((e) => {
        setXRPBalance(ERROR_STATE);
        setErrorMessage(e.message);
      });
  }, [fundWallet]);

  if (client === null) {
    return (
      <InformationMessage
        title="Failed to get assets"
        style={{
          padding: '15px'
        }}
      >
        <Typography style={{ marginBottom: '5px' }}>
          There was an error attempting to retrieve your assets. Please refresh and try again.
        </Typography>
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <Button variant="contained" onClick={reconnectToNetwork} style={{ marginBottom: '10px' }}>
            Refresh
          </Button>
          {errorMessage && <Typography style={{ color: ERROR_RED }}>{errorMessage}</Typography>}
        </div>
      </InformationMessage>
    );
  }

  if (XRPBalance === LOADING_STATE) {
    return <TokenLoader />;
  }
  const reserve = serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE;

  if (XRPBalance === ERROR_STATE) {
    return (
      <InformationMessage title="Account not activated">
        <div style={{ marginBottom: '5px' }}>
          To create this account to the XRP ledger, you will have to make a first deposit of a
          minimum {reserve} XRP.
        </div>
        <Link
          href="https://xrpl.org/reserves.html?utm_source=gemwallet.app"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about the account reserve.
        </Link>
        <div style={{ marginTop: '5px' }}>
          Your reserved XRP will not show up within your GemWallet's balance as you cannot spend it.
        </div>

        {network === Network.TESTNET && (
          <div style={{ margin: '15px 0px', textAlign: 'center' }}>
            <Button variant="contained" onClick={handleFundWallet} data-testid="fund-wallet-button">
              Fund Wallet
            </Button>
          </div>
        )}
      </InformationMessage>
    );
  }

  return (
    <div>
      <TokenDisplay
        balance={Number(XRPBalance) - reserve}
        token="XRP"
        isXRPToken
        onExplainClick={handleOpen}
      />
      {trustLineBalances.map((trustedLine) => {
        const currencyToDisplay = convertCurrencyString(trustedLine.currency);
        return (
          <TokenDisplay
            balance={Number(trustedLine.value)}
            token={currencyToDisplay}
            key={`${trustedLine.issuer}|${currencyToDisplay}`}
          />
        );
      })}
      <div style={{ height: '60px' }} />
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
              To create this account to the XRP ledger, you will have to make a first deposit of a
              minimum {reserve} XRP.
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
          <TokenDisplay balance={Number(XRPBalance)} isXRPToken token="XRP" />
          <Typography style={{ margin: '20px 0 10px 0' }}>Amount that can be spent</Typography>
          <TokenDisplay balance={Number(XRPBalance) - reserve} isXRPToken token="XRP" />
        </div>
      </Dialog>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 70,
          left: 0,
          right: 0,
          zIndex: 1
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate(`${ADD_NEW_TRUSTLINE_PATH}?showForm=true&inAppCall=true`)}
          style={{ marginTop: '20px' }}
        >
          Add trustline
        </Button>
      </div>
    </div>
  );
};
