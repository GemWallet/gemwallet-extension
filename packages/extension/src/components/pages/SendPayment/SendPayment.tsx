import { FC, FocusEvent, useCallback, useEffect, useState } from 'react';

import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import * as Sentry from '@sentry/react';
import { isValidAddress } from 'xrpl';

import { useNetwork, useWallet } from '../../../contexts';
import { NumericInput } from '../../atoms';
import { PageWithHeader, PageWithSpinner } from '../../templates';

export const SendPayment: FC = () => {
  const { client } = useNetwork();
  const { getCurrentWallet } = useWallet();
  const [errorAddress, setErrorAddress] = useState<string | undefined>();
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

  const handleAddressBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value !== '') {
      setErrorAddress(
        !isValidAddress(e.target.value) ? 'Your destination address is invalid' : undefined
      );
    }
  }, []);

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
          style={{ marginTop: '20px', marginBottom: !errorAddress ? '33px' : '10px' }}
        />
        <FormControl fullWidth style={{ marginBottom: '33px' }}>
          <InputLabel id="token-label">Token</InputLabel>
          <Select
            labelId="token-label"
            id="demo-simple-select"
            defaultValue={`${tokens[0].currency}-${tokens[0].issuer}`}
            label="Token"
            onChange={() => {}}
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
        <NumericInput label="Amount" fullWidth style={{ marginBottom: '33px' }} />
        <Button fullWidth variant="contained">
          Send Payment
        </Button>
      </div>
    </PageWithHeader>
  );
};
