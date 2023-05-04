import { FC, FocusEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { KeyboardArrowLeft } from '@mui/icons-material';
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { isValidAddress } from 'xrpl';

import { Memo } from '@gemwallet/constants';

import { HOME_PATH, navigation } from '../../../../constants';
import { useNetwork, useWallet } from '../../../../contexts';
import { convertCurrencyString } from '../../../../utils';
import { buildDefaultMemos } from '../../../../utils/payment';
import { NumericInput } from '../../../atoms';
import { InformationMessage } from '../../../molecules';
import { PageWithNavMenu, PageWithReturn, PageWithSpinner } from '../../../templates';

const MAX_MEMO_LENGTH = 300;
const MAX_DESTINATION_TAG_LENGTH = 10;
const INDEX_DEFAULT_NAV = navigation.findIndex((link) => link.pathname === HOME_PATH);

export interface PreparePaymentProps {
  onSendPaymentClick: ({
    address,
    token,
    value,
    memos,
    destinationTag
  }: {
    address: string;
    token: string;
    value: string;
    memos?: Memo[];
    destinationTag?: string;
  }) => void;
}

export const PreparePayment: FC<PreparePaymentProps> = ({ onSendPaymentClick }) => {
  const { client } = useNetwork();
  const { getCurrentWallet } = useWallet();
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [memos, setMemos] = useState<Memo[] | undefined>(undefined);
  const [destinationTag, setDestinationTag] = useState<string | undefined>(undefined);
  const [errorAddress, setErrorAddress] = useState<string>('');
  const [errorAmount, setErrorAmount] = useState<string>('');
  const [errorMemo, setErrorMemo] = useState<string>('');
  const [errorDestinationTag, setErrorDestinationTag] = useState<string>('');
  const [tokens, setTokens] = useState<
    | {
        value: string;
        currency: string;
        issuer?: string;
      }[]
    | undefined
  >();
  const [errorTokens, setErrorTokens] = useState<string>('');
  const [isWalletActivated, setIsWalletActivated] = useState<boolean>(true);
  const tokenRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBalances() {
      try {
        const currentWallet = getCurrentWallet();
        if (currentWallet?.publicAddress) {
          const balances = await client?.getBalances(currentWallet.publicAddress);
          setTokens(balances);
        } else {
          setErrorTokens("Impossible to fetch tokens, we couldn't get your current wallet");
        }
      } catch (e: any) {
        setErrorTokens('Impossible to fetch tokens, please try again');
        Sentry.captureException(e);
      }
    }

    fetchBalances();
  }, [client, getCurrentWallet]);

  useEffect(() => {
    async function checkWalletActivated() {
      try {
        const wallet = getCurrentWallet();
        await client?.getXrpBalance(wallet!.publicAddress);
        setIsWalletActivated(true);
      } catch (e) {
        setIsWalletActivated(false);
      }
    }

    checkWalletActivated();
  }, [client, getCurrentWallet]);

  const hasEnoughFunds = useCallback(
    (amountToSend: string, currentToken) => {
      const [currency, issuer] = currentToken.split('-');
      const token = tokens?.find((token) => {
        if (currency === 'XRP') {
          return token.currency === 'XRP';
        }
        return token.currency === currency && token.issuer === issuer;
      });

      return token && Number(token.value) >= Number(amountToSend);
    },
    [tokens]
  );

  const hasValidMemoLength = useCallback((memo: string | undefined) => {
    return memo === undefined || memo.length <= MAX_MEMO_LENGTH;
  }, []);

  const hasValidDestinationTag = useCallback((destinationTag: string | undefined) => {
    if (destinationTag === undefined || destinationTag === '') {
      return true;
    }

    // Must be an integer greater or equal to 0
    const isValidNumber = /^\d+$/.test(destinationTag);
    if (!isValidNumber || Number(destinationTag) < 0) {
      return false;
    }

    // Must be 'MAX_DESTINATION_TAG_LENGTH' digits or less
    return destinationTag.length <= MAX_DESTINATION_TAG_LENGTH;
  }, []);

  const handleAddressChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const currentWallet = getCurrentWallet();
      if (e.target.value === currentWallet?.publicAddress) {
        setErrorAddress('You cannot make a payment to yourself');
      } else if (e.target.value !== '') {
        setErrorAddress(
          !isValidAddress(e.target.value) ? 'Your destination address is invalid' : ''
        );
      }
      setAddress(e.target.value);
    },
    [getCurrentWallet]
  );

  const handleTokenChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      if (!hasEnoughFunds(amount, e.target.value)) {
        setErrorAmount('You do not have enough funds to send this amount');
      } else {
        setErrorAmount('');
      }
    },
    [amount, hasEnoughFunds]
  );

  const handleAmountChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      // Int and decimal numbers only
      const isValidNumber = /^\d*\.?\d*$/.test(e.target.value);

      if (Number(e.target.value) <= 0 && e.target.value !== '' && isValidNumber) {
        setErrorAmount('You can only send an amount greater than zero');
      } else if (
        Number(e.target.value) &&
        !hasEnoughFunds(e.target.value, tokenRef.current?.value ?? '') &&
        isValidNumber
      ) {
        setErrorAmount('You do not have enough funds to send this amount');
      } else if (isValidNumber) {
        setErrorAmount('');
      }
      if (Number(e.target.value)) {
        setAmount(e.target.value);
      }
    },
    [hasEnoughFunds]
  );

  const handleMemoChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (!hasValidMemoLength(e.target.value)) {
        setErrorMemo(`Your memo is too long, it cannot exceed ${MAX_MEMO_LENGTH} characters`);
      } else {
        setErrorMemo('');
      }
      setMemos(buildDefaultMemos(e.target.value));
    },
    [hasValidMemoLength]
  );

  const handleDestinationTagChange = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (Number(e.target.value) < 0 && e.target.value !== '') {
        setErrorDestinationTag('The destination tag cannot be a negative number');
      } else if (!Number.isInteger(Number(e.target.value)) || e.target.value.endsWith('.')) {
        setErrorDestinationTag('The destination tag cannot be a decimal number');
      } else if (Number(e.target.value) && e.target.value.length > MAX_DESTINATION_TAG_LENGTH) {
        setErrorDestinationTag(
          `The destination tag cannot exceed ${MAX_DESTINATION_TAG_LENGTH} digits`
        );
      } else if (hasValidDestinationTag(e.target.value)) {
        setErrorDestinationTag('');
      }

      if (Number(e.target.value)) {
        setDestinationTag(e.target.value);
      }
    },
    [hasValidDestinationTag]
  );

  const isSendPaymentDisabled = useMemo(() => {
    return !(
      address !== '' &&
      isValidAddress(address) &&
      amount !== '' &&
      errorAddress === '' &&
      errorMemo === '' &&
      errorDestinationTag === ''
    );
  }, [address, amount, errorAddress, errorDestinationTag, errorMemo]);

  const handleSendPayment = useCallback(() => {
    if (!isSendPaymentDisabled) {
      onSendPaymentClick({
        address,
        token:
          tokenRef.current?.value === 'XRP-undefined' ? 'XRP' : tokenRef.current?.value ?? 'XRP',
        value: amount,
        memos,
        destinationTag
      });
    }
  }, [address, amount, destinationTag, isSendPaymentDisabled, memos, onSendPaymentClick]);

  if (!isWalletActivated) {
    return (
      <PageWithNavMenu indexDefaultNav={INDEX_DEFAULT_NAV}>
        <div
          style={{
            padding: '0.75rem 1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <IconButton
            style={{ position: 'fixed', left: 0 }}
            aria-label="close"
            onClick={() => navigate(HOME_PATH)}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Typography variant="h6">Send Payment</Typography>
        </div>
        <Divider />
        <div
          data-testid="wallet-not-activated"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 112px)',
            margin: '20px 20px',
            overflowY: 'auto'
          }}
        >
          <InformationMessage title="Wallet not activated">
            <div style={{ marginBottom: '5px' }}>
              You cannot send a payment because your wallet is not activated
            </div>
          </InformationMessage>
        </div>
      </PageWithNavMenu>
    );
  }

  if (!tokens) {
    return <PageWithSpinner />;
  }

  if (errorTokens !== '') {
    return (
      <InformationMessage title="Something went wrong">
        <div style={{ marginBottom: '5px' }}>{errorTokens}</div>
      </InformationMessage>
    );
  }

  return (
    <PageWithReturn
      title="Send Payment"
      onBackClick={() => navigate(-1)}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}
    >
      <div>
        <TextField
          label="Recipient's address"
          id="recipient-address"
          name="recipient-address"
          fullWidth
          error={!!errorAddress}
          helperText={errorAddress}
          onChange={handleAddressChange}
          style={{ marginTop: '20px', marginBottom: errorAddress === '' ? '33px' : '10px' }}
          autoComplete="off"
        />
        <FormControl fullWidth style={{ marginBottom: '33px' }}>
          <InputLabel id="token-label">Token</InputLabel>
          <Select
            labelId="token-label"
            id="token-select"
            inputRef={tokenRef}
            defaultValue={`${tokens[0].currency}-${tokens[0].issuer}`}
            label="Token"
            onChange={handleTokenChange}
          >
            {tokens.map((token) => (
              <MenuItem
                key={`${token.currency}-${token.issuer}`}
                value={`${token.currency}-${token.issuer}`}
              >
                {convertCurrencyString(token.currency)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <NumericInput
          label="Amount"
          id="amount"
          name="amount"
          fullWidth
          style={{ marginBottom: '33px' }}
          error={!!errorAmount}
          helperText={errorAmount}
          onChange={handleAmountChange}
          autoComplete="off"
        />
        <TextField
          label="Memo (optional)"
          id="memo"
          name="memo"
          fullWidth
          style={{ marginBottom: '33px' }}
          error={!!errorMemo}
          helperText={errorMemo}
          onChange={handleMemoChange}
          autoComplete="off"
        />
        <NumericInput
          label="Destination Tag (optional, numeric)"
          id="destination-tag"
          name="destination-tag"
          fullWidth
          style={{ marginBottom: '33px' }}
          error={!!errorDestinationTag}
          helperText={errorDestinationTag}
          onChange={handleDestinationTagChange}
          autoComplete="off"
        />
      </div>
      <Button
        fullWidth
        variant="contained"
        onClick={handleSendPayment}
        disabled={isSendPaymentDisabled}
      >
        Send Payment
      </Button>
    </PageWithReturn>
  );
};
