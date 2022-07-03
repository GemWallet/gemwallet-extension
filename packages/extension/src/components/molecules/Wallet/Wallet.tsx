import { useState, useEffect, FC } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useLedger } from '../../../contexts/LedgerContext';
import { formatToken } from '../../../utils';
import { TileLoader } from '../../atoms';

const LOADING_STATE = 'Loading...';
const ERROR_STATE = 'Error';

export interface WalletProps {
  address: string;
}

export const Wallet: FC<WalletProps> = ({ address }) => {
  const [balance, setBalance] = useState(LOADING_STATE);
  const { client } = useLedger();

  useEffect(() => {
    async function fetchBalance() {
      try {
        const balance = await client?.getXrpBalance(address);
        if (balance) {
          setBalance(balance);
        }
      } catch {
        setBalance(ERROR_STATE);
      }
    }

    fetchBalance();
  }, [address, client]);

  return (
    <Paper elevation={24} style={{ padding: '10px' }}>
      <Typography variant="body1">Balance</Typography>
      <Paper
        elevation={5}
        style={{
          display: 'flex',
          justifyContent: balance !== ERROR_STATE ? 'end' : 'center',
          padding: '10px',
          marginTop: '10px'
        }}
      >
        <Typography variant="body1">
          {balance === LOADING_STATE ? (
            <TileLoader secondLineOnly swidth={100} />
          ) : balance !== ERROR_STATE ? (
            formatToken(Number(balance), 'XRP')
          ) : (
            'There are no funds on your wallet'
          )}
        </Typography>
      </Paper>
    </Paper>
  );
};
