import { FC, useCallback, useMemo, useState } from 'react';

import { Button, Link, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { TrustSetFlags as TrustSetFlagsBitmask } from 'xrpl';

import { Chain, XahauNetwork, XRPLNetwork } from '@gemwallet/constants';

import {
  ADD_NEW_TRUSTLINE_PATH,
  DEFAULT_RESERVE,
  ERROR_RED,
  STORAGE_MESSAGING_KEY
} from '../../../constants';
import { useLedger, useNetwork, useServer } from '../../../contexts';
import { useAccountBalances, accountQueryKeys, useMainToken } from '../../../hooks';
import { convertHexCurrencyString, generateKey, saveInChromeSessionStorage } from '../../../utils';
import { isLPToken } from '../../../utils/trustlines';
import { TokenLoader } from '../../atoms';
import { InformationMessage } from '../../molecules/InformationMessage';
import { TokenDisplay } from '../../molecules/TokenDisplay';
import { MPTokenListing } from '../MPTokenListing';
import { DialogPage } from '../../templates';

export interface TokenListingProps {
  address: string;
}

export const TokenListing: FC<TokenListingProps> = ({ address }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const { client, reconnectToNetwork, networkName, chainName } = useNetwork();
  const { serverInfo } = useServer();
  const { fundWallet } = useLedger();
  const mainToken = useMainToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Use cached account balances - data persists across page navigations
  const { data: accountData, isLoading, isError } = useAccountBalances(address);

  const mainTokenBalance = accountData?.mainTokenBalance || '0';
  const trustLineBalances = accountData?.trustLineBalances || [];
  const reserve = accountData?.reserve || DEFAULT_RESERVE;
  const ownerReserve = accountData?.ownerReserve || 0;
  const baseReserve =
    accountData?.baseReserve ||
    serverInfo?.info.validated_ledger?.reserve_base_xrp ||
    DEFAULT_RESERVE;

  const handleOpen = useCallback(() => {
    setExplanationOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setExplanationOpen(false);
  }, []);

  const hasFundWallet = useMemo(() => {
    switch (chainName) {
      case Chain.XRPL:
        return networkName === XRPLNetwork.TESTNET || networkName === XRPLNetwork.DEVNET;
      case Chain.XAHAU:
        return networkName === XahauNetwork.XAHAU_TESTNET;
      default:
        return false;
    }
  }, [chainName, networkName]);

  const handleFundWallet = useCallback(() => {
    setErrorMessage('');
    setIsFunding(true);
    fundWallet()
      .then(() => {
        // Invalidate the cache to refetch fresh balances
        queryClient.invalidateQueries({
          queryKey: accountQueryKeys.balances(address, networkName)
        });
      })
      .catch((e) => {
        setErrorMessage(e.message);
      })
      .finally(() => {
        setIsFunding(false);
      });
  }, [fundWallet, queryClient, address, networkName]);

  if (client === null) {
    return (
      <InformationMessage
        title="Failed to connect to the network"
        style={{
          padding: '15px'
        }}
      >
        <Typography style={{ marginBottom: '5px' }}>
          There was an error attempting to connect to the network. Please refresh the page and try
          again.
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

  if (isLoading || isFunding) {
    return <TokenLoader />;
  }

  if (isError) {
    return (
      <InformationMessage title="Account not activated">
        <div style={{ marginBottom: '5px' }}>
          To create this account to the XRP ledger, you will have to make a first deposit of a
          minimum {baseReserve} {mainToken}.
        </div>
        <Link
          href="https://xrpl.org/reserves.html?utm_source=gemwallet.app"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about the account reserve.
        </Link>
        <div style={{ marginTop: '5px' }}>
          Your reserved {mainToken} will not show up within your GemWallet's balance as you cannot
          spend it.
        </div>

        {hasFundWallet && (
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
        balance={Number(mainTokenBalance) - reserve}
        token={mainToken}
        isMainToken
        onExplainClick={handleOpen}
      />
      {trustLineBalances.map((trustedLine) => {
        const isAMMLPToken = isLPToken(trustedLine.currency);
        const currencyToDisplay = convertHexCurrencyString(trustedLine.currency);
        const canBeEdited =
          (trustedLine.trustlineDetails || trustedLine.value !== '0') && !isAMMLPToken;
        const limit = trustedLine.trustlineDetails?.limit || 0;
        const noRipple = trustedLine.trustlineDetails?.noRipple || false;
        const flags = noRipple ? TrustSetFlagsBitmask.tfSetNoRipple : undefined;
        const limitAmount = {
          currency: convertHexCurrencyString(trustedLine.currency),
          issuer: trustedLine.issuer,
          value: limit.toString()
        };
        return (
          <TokenDisplay
            balance={Number(trustedLine.value)}
            token={currencyToDisplay}
            issuer={trustedLine.issuer}
            key={`${trustedLine.issuer}|${currencyToDisplay}`}
            trustlineLimit={
              trustedLine.trustlineDetails?.limit ? trustedLine.trustlineDetails?.limit : 0
            }
            trustlineNoRipple={noRipple}
            // Show the Edit Trustline button if the trustline is not revoked or if the trustline has a non-zero balance
            onTrustlineDetailsClick={
              canBeEdited
                ? () => {
                    const key = generateKey();
                    saveInChromeSessionStorage(
                      key,
                      JSON.stringify({
                        limitAmount,
                        flags
                      })
                    ).then(() => {
                      navigate(
                        `${ADD_NEW_TRUSTLINE_PATH}?showForm=true&inAppCall=true&${STORAGE_MESSAGING_KEY}=${key}`
                      );
                    });
                  }
                : undefined
            }
          />
        );
      })}
      <MPTokenListing address={address} />
      <div style={{ height: '60px' }} />
      <DialogPage title="Account balance" onClose={handleClose} open={explanationOpen}>
        <div style={{ margin: '20px' }}>
          <InformationMessage
            title="Information"
            style={{
              padding: '15px'
            }}
          >
            <Typography style={{ marginBottom: '5px' }}>
              The activation of this account was made through a minimum deposit of {baseReserve}{' '}
              {mainToken}.
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
          <TokenDisplay balance={Number(mainTokenBalance)} isMainToken token={mainToken} />
          <Typography style={{ margin: '20px 0 10px 0' }}>Amount that can be spent</Typography>
          <TokenDisplay
            balance={Number(mainTokenBalance) - reserve}
            isMainToken
            token={mainToken}
          />
          <Typography style={{ margin: '20px 0 10px 0' }}>Base reserve</Typography>
          <TokenDisplay balance={baseReserve} isMainToken token={mainToken} />
          <Typography style={{ margin: '20px 0 10px 0' }}>Owner reserve</Typography>
          <TokenDisplay balance={ownerReserve} isMainToken token={mainToken} />
        </div>
      </DialogPage>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 57,
          left: 0,
          right: 0,
          zIndex: 1
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate(`${ADD_NEW_TRUSTLINE_PATH}?showForm=true&inAppCall=true`)}
          style={{ margin: '10px 0' }}
        >
          Add trustline
        </Button>
      </div>
    </div>
  );
};
