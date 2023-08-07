import { FC, useCallback, useMemo, useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import OutboundIcon from '@mui/icons-material/Outbound';
import { AppBar, Box, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import copyToClipboard from 'copy-to-clipboard';
import { useNavigate } from 'react-router-dom';

import {
  HEADER_HEIGHT_WITHOUT_PADDING,
  LIST_WALLETS_PATH,
  SECONDARY_GRAY,
  SEND_PATH,
  RECEIVE_PATH
} from '../../../constants';
import { useTimeout } from '../../../hooks';
import { WalletLedger } from '../../../types';
import { truncateAddress, truncateWalletName } from '../../../utils';
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

  const truncatedAddress = useMemo(() => truncateAddress(publicAddress), [publicAddress]);

  const handleShare = useCallback(() => {
    copyToClipboard(publicAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false));
  }, [publicAddress, setTimeout]);

  const handleSend = useCallback(() => {
    navigate(SEND_PATH);
  }, [navigate]);

  const handleReceive = useCallback(() => {
    navigate(RECEIVE_PATH);
  }, [navigate]);

  const onWalletIconClick = useCallback(() => {
    navigate(LIST_WALLETS_PATH);
  }, [navigate]);

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Typography variant="body2" style={{ marginTop: '10px' }}>
                {truncateWalletName(name, 22)}
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" style={{ margin: '3px 0', color: SECONDARY_GRAY }}>
                  {truncatedAddress}
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                onClick={handleReceive}
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
          </div>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
};
