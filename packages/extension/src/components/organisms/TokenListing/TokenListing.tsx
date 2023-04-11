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
import { useTranslation } from 'react-i18next';

import { DEFAULT_RESERVE } from '../../../constants';
import { useNetwork, useServer } from '../../../contexts';
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
  const [trustLineBalances, setTrustLineBalances] = useState<TrustLineBalance[]>([]);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const { client, reconnectToNetwork } = useNetwork();
  const { serverInfo } = useServer();
  const { t } = useTranslation('common');

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

  if (client === null) {
    return (
      <InformationMessage
        title="Failed to get assets"
        style={{
          padding: '15px'
        }}
      >
        <Typography style={{ marginBottom: '5px' }}>
          {t('TEXT_ERROR_RETRIEVING_ASSETS')}
        </Typography>
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <Button variant="contained" onClick={reconnectToNetwork}>
            {t('TEXT_REFRESH')}
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
      <InformationMessage title={t('TEXT_ACCOUNT_NOT_ACTIVATED') || "Account not activated"}>
        <div style={{ marginBottom: '5px' }}>
          {t('TEXT_DEPOSIT_REQUIRED', { reserve: reserve})}
        </div>
        <Link
          href="https://xrpl.org/reserves.html?utm_source=gemwallet.app"
          target="_blank"
          rel="noreferrer"
        >
          {t('TEXT_LEARN_MORE_ABOUT_RESERVE')}
        </Link>
        <div style={{ marginTop: '5px' }}>
          {t('TEXT_RESERVE_WILL_NOT_SHOW')}
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
              {t('TEXT_ACCOUNT_BALANCE')}
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
              {t('TEXT_DEPOSIT_REQUIRED', { reserve: reserve })}
            </Typography>
            <Link
              href="https://xrpl.org/reserves.html?utm_source=gemwallet.app"
              target="_blank"
              rel="noreferrer"
            >
              {t('TEXT_LEARN_MORE_ABOUT_RESERVE')}
            </Link>
          </InformationMessage>
          <Typography style={{ margin: '20px 0 10px 0' }}>{t('TEXT_ACCOUNT_BALANCE')}</Typography>
          <TokenDisplay balance={Number(XRPBalance)} isXRPToken token="XRP" />
          <Typography style={{ margin: '20px 0 10px 0' }}>{t('TEXT_AMOUNT_TO_SEND')}</Typography>
          <TokenDisplay balance={Number(XRPBalance) - reserve} isXRPToken token="XRP" />
        </div>
      </Dialog>
    </div>
  );
};
