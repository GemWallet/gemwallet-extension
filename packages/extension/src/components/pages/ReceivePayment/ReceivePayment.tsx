import { FC, useCallback, useMemo, useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { Tooltip, IconButton, Typography } from '@mui/material';
import copyToClipboard from 'copy-to-clipboard';
import QRCode from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

import { useWallet } from '../../../contexts';
import { truncateAddress } from '../../../utils';
import { InformationMessage } from '../../molecules';
import { PageWithReturn } from '../../templates';

export const ReceivePayment: FC = () => {
  const { wallets, selectedWallet } = useWallet();
  const navigate = useNavigate();

  const [isCopied, setIsCopied] = useState(false);

  const publicAddress = useMemo(
    () => wallets[selectedWallet]?.publicAddress,
    [selectedWallet, wallets]
  );
  const truncatedAddress = useMemo(() => truncateAddress(publicAddress), [publicAddress]);

  const handleCopy = useCallback(() => {
    if (publicAddress) {
      copyToClipboard(publicAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2 seconds
    }
  }, [publicAddress]);

  if (!wallets?.[selectedWallet]) {
    return (
      <InformationMessage title="Wallet not found">
        <div style={{ marginBottom: '5px' }}>Sorry we couldn't find your wallet</div>
      </InformationMessage>
    );
  }

  return (
    <PageWithReturn
      title="Receive Payment"
      onBackClick={() => navigate(-1)}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}
    >
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

        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
          <Typography variant="body1">{truncatedAddress}</Typography>
          <Tooltip title="Copy your address">
            <IconButton
              size="small"
              edge="end"
              color="inherit"
              aria-label="Copy"
              onClick={handleCopy}
            >
              {isCopied ? (
                <DoneIcon sx={{ fontSize: '0.9rem' }} color="success" />
              ) : (
                <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
              )}
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </PageWithReturn>
  );
};
