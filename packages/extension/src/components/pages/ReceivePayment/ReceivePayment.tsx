import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import QRCode from 'qrcode.react';

import { useWallet } from '../../../contexts';
import { truncateAddress } from '../../../utils';
import { InformationMessage } from '../../molecules';
import { PageWithHeader } from '../../templates';

export const ReceivePayment: FC = () => {
  const { wallets, selectedWallet } = useWallet();

  const [isCopied, setIsCopied] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const publicAddress = useMemo(
    () => wallets[selectedWallet].publicAddress,
    [selectedWallet, wallets]
  );
  const truncatedAddress = useMemo(() => truncateAddress(publicAddress), [publicAddress]);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(publicAddress);
      setIsCopied(true);
      const id = setTimeout(() => setIsCopied(false), 3000);
      setTimeoutId(id);
    } catch (err) {}
  }, [publicAddress]);

  if (!wallets?.[selectedWallet]) {
    return (
      <InformationMessage title="Wallet not found">
        <div style={{ marginBottom: '5px' }}>Sorry we couldn't find your wallet</div>
      </InformationMessage>
    );
  }

  return (
    <PageWithHeader>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <QRCode
          value={publicAddress}
          size={220}
          level="M"
          style={{
            marginTop: '30px',
            borderRadius: '2px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8px'
          }}
        />
        <Typography
          variant="body1"
          style={{
            margin: '10px'
          }}
        >
          {truncatedAddress}
        </Typography>
        <Tooltip title={isCopied ? 'Copied!' : 'Click to copy'}>
          <div
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              margin: '5px'
            }}
          >
            <Button variant="contained" color="primary" onClick={handleCopy}>
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </Tooltip>
      </div>
    </PageWithHeader>
  );
};
