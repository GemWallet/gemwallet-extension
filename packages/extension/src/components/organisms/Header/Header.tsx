import { FC, useCallback, useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import OutboundIcon from '@mui/icons-material/Outbound';
import { AppBar, Box, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import copyToClipboard from 'copy-to-clipboard';
import QrCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

import {
  HEADER_HEIGHT_WITHOUT_PADDING,
  LIST_WALLETS_PATH,
  SECONDARY_GRAY,
  SEND_PATH
} from '../../../constants';
import { useTimeout } from '../../../hooks';
import { WalletLedger } from '../../../types';
import { truncateWalletName } from '../../../utils';
import { WalletIcon } from '../../atoms';
import { NetworkIndicator } from '../../molecules';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'block',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    height: HEADER_HEIGHT_WITHOUT_PADDING
  }
}));

export interface HeaderProps {
  wallet: WalletLedger;
}

export const Header: FC<HeaderProps> = ({ wallet: { name, publicAddress } }) => {
  const navigate = useNavigate();
  const setTimeout = useTimeout(2000);

  const [isCopied, setIsCopied] = useState(false);
  const [showQR, setShowQR] = useState(false); // State to control the QR code visibility

  const handleShare = useCallback(() => {
    copyToClipboard(publicAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false));
  }, [publicAddress, setTimeout]);

  const handleSend = useCallback(() => {
    navigate(SEND_PATH);
  }, [navigate]);

  const onWalletIconClick = useCallback(() => {
    navigate(LIST_WALLETS_PATH);
  }, [navigate]);

  const handleReceive = useCallback(() => {
    setShowQR(!showQR); // Toggle QR code visibility when the receive button is clicked
  }, [showQR]);

  // Function to abbreviate the wallet address
  const abbreviateAddress = (address: string, maxLength = 8) => {
    if (address.length <= maxLength) return address;
    const halfLength = Math.floor(maxLength / 2);
    return address.slice(0, halfLength) + '...' + address.slice(-halfLength);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <StyledToolbar>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <WalletIcon
              publicAddress={publicAddress}
              onClick={onWalletIconClick}
              isConnectedInformation
            />
            <NetworkIndicator />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Typography variant="body2" style={{ marginTop: '10px' }}>
                {truncateWalletName(name, 22)}
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" style={{ margin: '3px 0', color: SECONDARY_GRAY }}>
                  {abbreviateAddress(publicAddress)}
                </Typography>
                <Tooltip title="Copy your address">
                  <IconButton
                    size="small"
                    edge="end"
                    color="inherit"
                    aria-label="Copy"
                    onClick={handleShare}
                  >
                    {isCopied ? (
                      <DoneIcon sx={{ fontSize: '0.9rem' }} color="success" />
                    ) : (
                      <ContentCopyIcon sx={{ fontSize: '0.9rem' }} htmlColor={SECONDARY_GRAY} />
                    )}
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <Button
              aria-label="send"
              size="small"
              onClick={handleSend}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <OutboundIcon
                style={{
                  transform: 'rotate(-45deg)',
                  color: 'white'
                }}
              />
              <Typography color="white" variant="caption">
                Send
              </Typography>
            </Button>
            <Button
              aria-label="receive"
              size="small"
              onClick={handleReceive} // Use the handleReceive function for the receive button
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <OutboundIcon
                style={{
                  transform: 'rotate(135deg)',
                  color: 'white'
                }}
              />
              <Typography color="white" variant="caption">
                Receive
              </Typography>
            </Button>
          </div>
          {/* Conditionally render the QR code based on the showQR state */}
          {showQR && (
            <div style={{ marginTop: '115px', textAlign: 'center' }}>
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'inline-block'
                }}
              >
                {/* Add a white background to create a margin around the QR code */}
                <div style={{ backgroundColor: 'white', padding: '4px' }}>
                  <QrCode
                    value={publicAddress}
                    size={200}
                    fgColor="#000000" // QR code foreground color
                    bgColor="#FFFFFF" // QR code background color
                    level="L" // Error correction level (you can adjust it based on your needs)
                  />
                </div>
              </div>
              <Typography color="white" variant="body1" style={{ marginTop: '10px' }}>
                Wallet Address:
              </Typography>
              <Typography color="white" variant="body2">
                {abbreviateAddress(publicAddress)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleShare}
                style={{ marginTop: '10px' }}
              >
                Copy
              </Button>
            </div>
          )}
        </StyledToolbar>
      </AppBar>
    </Box>
  );
};
