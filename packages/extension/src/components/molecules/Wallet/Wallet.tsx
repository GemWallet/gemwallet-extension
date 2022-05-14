import { useState, useEffect, FC } from 'react';
import copyToClipboard from 'copy-to-clipboard';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
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
        setBalance(ERROR_STATE);
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
      {address === LOADING_STATE ? (
        <TileLoader firstLineOnly fwidth={280} />
      ) : (
        <Typography variant="body2" style={{ margin: '10px 0' }}>
          {address}
        </Typography>
      )}
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
