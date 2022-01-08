import { useState, useEffect } from 'react';
import copyToClipboard from 'copy-to-clipboard';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import { useLedger } from '../../../contexts/LedgerContext';
import { PropType } from './Wallet.types';

export function Wallet({ address = '' }: PropType) {
  const [balance, setBalance] = useState('Loading');
  const [hasBalance, setHasBalance] = useState(true);
  const [isShared, setIsShared] = useState(false);
  const { client } = useLedger();

  useEffect(() => {
    async function fetchBalance() {
      try {
        const balance = await client?.getXrpBalance(address);
        if (balance) {
          setBalance(balance);
        }
      } catch {
        setHasBalance(false);
      }
    }

    fetchBalance();
  }, [address, client]);

  const handleShare = () => {
    copyToClipboard(address);
    setIsShared(true);
    setTimeout(() => setIsShared(false), 5000);
  };

  return (
    <Paper elevation={24} style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Wallet</Typography>
        <Tooltip title="Share your public address">
          <IconButton
            size="small"
            edge="end"
            color="inherit"
            aria-label="Copy"
            onClick={handleShare}
          >
            {isShared ? <ShareIcon color="success" /> : <ShareIcon />}
          </IconButton>
        </Tooltip>
      </div>
      <Typography variant="body2" style={{ margin: '10px 0' }}>
        {address}
      </Typography>
      <Typography variant="body1">Balance</Typography>
      <Paper
        elevation={5}
        style={{
          display: 'flex',
          justifyContent: hasBalance ? 'end' : 'center',
          padding: '10px',
          marginTop: '10px'
        }}
      >
        <Typography variant="body1">
          {hasBalance ? `${balance} XRP` : 'There are no funds on your wallet'}
        </Typography>
      </Paper>
    </Paper>
  );
}
