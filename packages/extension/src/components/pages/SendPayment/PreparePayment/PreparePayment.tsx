import { FC, FocusEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { isValidAddress } from 'xrpl';

import { useNetwork, useWallet } from '../../../../contexts';
import { NumericInput } from '../../../atoms';
import { InformationMessage } from '../../../molecules';
import { PageWithReturn, PageWithSpinner } from '../../../templates';

export interface PreparePaymentProps {
  onSendPaymentClick: ({
    address,
    token,
    amount
  }: {
    address: string;
    token: string;
    amount: string;
  }) => void;
}

export const PreparePayment: FC<PreparePaymentProps> = ({ onSendPaymentClick }) => {
  const { client } = useNetwork();
  const { getCurrentWallet } = useWallet();
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [errorAddress, setErrorAddress] = useState<string>('');
  const [errorAmount, setErrorAmount] = useState<string>('');
  const [tokens, setTokens] = useState<
    | {
        value: string;
        currency: string;
        issuer?: string | undefined;
      }[]
    | undefined
  >();
  const [errorTokens, setErrorTokens] = useState<string>('');
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

  const handleAddressBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value !== '') {
      setErrorAddress(!isValidAddress(e.target.value) ? 'Your destination address is invalid' : '');
    }
  }, []);

  const handleAddressChange = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  }, []);

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
      if (Number(e.target.value) <= 0 && e.target.value !== '') {
        setErrorAmount('You can only send an amount greater than zero');
      } else if (
        Number(e.target.value) &&
        !hasEnoughFunds(e.target.value, tokenRef.current?.value ?? '')
      ) {
        setErrorAmount('You do not have enough funds to send this amount');
      } else {
        setErrorAmount('');
      }
      if (Number(e.target.value)) {
        setAmount(e.target.value);
      }
    },
    [hasEnoughFunds]
  );

  const isSendPaymentDisabled = useMemo(() => {
    return !(address !== '' && isValidAddress(address) && amount !== '' && errorAddress === '');
  }, [address, amount, errorAddress]);

  const handleSendPayment = useCallback(() => {
    if (!isSendPaymentDisabled) {
      onSendPaymentClick({
        address,
        token:
          tokenRef.current?.value === 'XRP-undefined' ? 'XRP' : tokenRef.current?.value ?? 'XRP',
        amount
      });
    }
  }, [address, amount, isSendPaymentDisabled, onSendPaymentClick]);

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
          fullWidth
          error={!!errorAddress}
          helperText={errorAddress}
          onBlur={handleAddressBlur}
          onChange={handleAddressChange}
          style={{ marginTop: '20px', marginBottom: errorAddress === '' ? '33px' : '10px' }}
          autoComplete="off"
        />
        <FormControl fullWidth style={{ marginBottom: '33px' }}>
          <InputLabel id="token-label">Token</InputLabel>
          <Select
            labelId="token-label"
            id="demo-simple-select"
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
                {token.currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <NumericInput
          label="Amount"
          fullWidth
          style={{ marginBottom: '33px' }}
          error={!!errorAmount}
          helperText={errorAmount}
          onChange={handleAmountChange}
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
