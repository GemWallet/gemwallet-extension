import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useLedger } from '../../../contexts/LedgerContext';
import { PropType } from './Wallet.types';

export function Wallet({ address = '' }: PropType) {
  const [balance, setBalance] = useState('Loading');
  const { client } = useLedger();

  useEffect(() => {
    async function fetchBalance() {
      const balance = await client?.getXrpBalance(address);
      if (balance) {
        setBalance(balance);
      } else {
        setBalance('There are no funds on your wallet');
      }
    }

    fetchBalance();
  }, [address, client]);

  return (
    <Paper elevation={24} style={{ padding: '10px' }}>
      <Typography variant="h5">Wallet</Typography>
      <Typography variant="body2" style={{ margin: '10px 0' }}>
        {address}
      </Typography>
      <Typography variant="body1">Balance</Typography>
      <Paper
        elevation={5}
        style={{ display: 'flex', justifyContent: 'end', padding: '10px', marginTop: '10px' }}
      >
        <Typography variant="body1">{balance} XRP</Typography>
      </Paper>
    </Paper>
  );
}
