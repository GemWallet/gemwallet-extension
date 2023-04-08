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
import { isValidAddress } from 'xrpl';

import { useNetwork, useWallet } from '../../../../contexts';
import { NumericInput } from '../../../atoms';
import { PageWithHeader, PageWithSpinner } from '../../../templates';

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
  const tokenRef = useRef<HTMLInputElement | null>(null);

  const [tokens, setTokens] = useState<
    | {
        value: string;
        currency: string;
        issuer?: string | undefined;
      }[]
    | undefined
  >();

  useEffect(() => {
    async function fetchBalance() {
      try {
        const currentWallet = getCurrentWallet();
        if (currentWallet?.publicAddress) {
          const balances = await client?.getBalances(currentWallet.publicAddress);
          setTokens(balances);
        } else {
          // Handle this case
        }
      } catch (e: any) {
        Sentry.captureException(e);
        // setXRPBalance(ERROR_STATE);
      }
    }

    fetchBalance();
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
    setAddress(e.target.value);
    if (e.target.value !== '') {
      setErrorAddress(!isValidAddress(e.target.value) ? 'Your destination address is invalid' : '');
    }
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

  const handleAmountBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (Number(e.target.value) <= 0 && e.target.value !== '') {
        setErrorAmount('You can only send an amount greater than zero');
      } else if (!hasEnoughFunds(e.target.value, tokenRef.current?.value ?? '')) {
        setErrorAmount('You do not have enough funds to send this amount');
      } else {
        setErrorAmount('');
      }
      setAmount(e.target.value);
    },
    [hasEnoughFunds]
  );

  const isSendPaymentDisabled = useMemo(() => {
    return !(address !== '' && amount !== '' && errorAddress === '');
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

  return (
    <PageWithHeader title="Send Payment" disableSendButton>
      <div>
        <TextField
          label="Recipient's address"
          fullWidth
          error={!!errorAddress}
          helperText={errorAddress}
          onBlur={handleAddressBlur}
          style={{ marginTop: '20px', marginBottom: errorAddress === '' ? '33px' : '10px' }}
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
          onBlur={handleAmountBlur}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSendPayment}
          disabled={isSendPaymentDisabled}
        >
          Send Payment
        </Button>
      </div>
    </PageWithHeader>
  );
};
