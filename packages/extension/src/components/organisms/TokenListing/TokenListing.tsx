import { useState, useEffect, FC, forwardRef, useCallback, FocusEvent, useMemo } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Link,
  Slide,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';

import { ADD_NEW_TRUSTLINE_PATH, DEFAULT_RESERVE } from '../../../constants';
import { useNetwork, useServer } from '../../../contexts';
import { convertCurrencyString } from '../../../utils';
import { NumericInput, TokenLoader } from '../../atoms';
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
  const [trustLineBalances, setTrustLineBalances] = useState<TrustLineBalance[]>([]);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [trustlineDialogOpen, setTrustlineDialogOpen] = useState(false);
  const [issuer, setIssuer] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [limit, setLimit] = useState<string>('');
  const [errorIssuer, setErrorIssuer] = useState<string>('');
  const [errorToken, setErrorToken] = useState<string>('');
  const [errorLimit, setErrorLimit] = useState<string>('');
  const { client, reconnectToNetwork } = useNetwork();
  const { serverInfo } = useServer();
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

  const handleTrustlineDialogOpen = useCallback(() => {
    setTrustlineDialogOpen(true);
  }, []);

  const handleTrustlineClose = useCallback(() => {
    setTrustlineDialogOpen(false);
  }, []);

  const handleTokenChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setErrorToken('');
      setToken(e.target.value);
    },
    []
  );

  const handleIssuerChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setErrorIssuer('');
      setIssuer(e.target.value);
    },
    []
  );

  const handleLimitChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setErrorLimit('');
      setLimit(e.target.value);
    },
    []
  );

  const isAddTrustlineDisabled = useMemo(() => {
    return !(
      issuer !== '' &&
      token !== '' &&
      limit !== '' &&
      errorIssuer === '' &&
      errorToken === '' &&
      errorLimit === ''
    );
  }, [errorIssuer, errorLimit, errorToken, issuer, limit, token]);

  const handleAddTrustline = useCallback(
    () => {
      navigate(`${ADD_NEW_TRUSTLINE_PATH}?value=${limit}&currency=${token}&issuer=${issuer}&inAppCall=true`);
    },
    [issuer, limit, navigate, token]
  );

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
          <Button variant="contained" onClick={reconnectToNetwork}>
            Refresh
          </Button>
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
          flexDirection: 'column',
        }}
      >
        <Button
          variant="contained"
          onClick={handleTrustlineDialogOpen}
          style={{ marginTop: '20px' }}
        >
          Add trustline
        </Button>
      </div>
      <Dialog
        fullScreen
        open={trustlineDialogOpen}
        onClose={handleTrustlineClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleTrustlineClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add trustline
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ margin: '20px' }}>
          <TextField
            label="Issuer"
            id="issuer"
            name="issuer"
            fullWidth
            error={!!errorIssuer}
            helperText={errorIssuer}
            onChange={handleIssuerChange}
            style={{ marginTop: '20px', marginBottom: '10px' }}
            autoComplete="off"
          />
          <TextField
            label="Token"
            id="token"
            name="token"
            fullWidth
            error={!!errorToken}
            helperText={errorToken}
            onChange={handleTokenChange}
            style={{ marginTop: '20px', marginBottom: '10px' }}
            autoComplete="off"
          />
          <NumericInput
            label="Limit"
            id="limit"
            name="limit"
            fullWidth
            style={{ marginTop: '20px', marginBottom: '10px' }}
            error={!!errorLimit}
            helperText={errorLimit}
            onChange={handleLimitChange}
            autoComplete="off"
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddTrustline}
            disabled={isAddTrustlineDisabled}
            style={{ marginTop: '20px', marginBottom: '10px' }}
          >
            Add trustline
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
