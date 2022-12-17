import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import copyToClipboard from 'copy-to-clipboard';
import { useNavigate } from 'react-router-dom';

import { HEADER_HEIGHT_WITHOUT_PADDING, LIST_WALLETS, SECONDARY_GRAY } from '../../../constants';
import { WalletLedger } from '../../../types';
import { truncateAddress } from '../../../utils';
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

const resetTimeout = (timeoutReference: NodeJS.Timeout | null) => {
  if (timeoutReference) {
    clearTimeout(timeoutReference);
  }
};

export interface HeaderProps {
  wallet: WalletLedger;
}

export const Header: FC<HeaderProps> = ({ wallet: { name, publicAddress } }) => {
  const navigate = useNavigate();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    return () => resetTimeout(timerRef.current);
  }, []);

  const truncatedAddress = useMemo(() => truncateAddress(publicAddress), [publicAddress]);

  const handleShare = useCallback(() => {
    resetTimeout(timerRef.current);
    copyToClipboard(publicAddress);
    setIsCopied(true);
    timerRef.current = setTimeout(() => setIsCopied(false), 2000);
  }, [publicAddress]);

  const onWalletIconClick = useCallback(() => {
    navigate(LIST_WALLETS);
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
          <Typography variant="body2" style={{ marginTop: '10px' }}>
            {name}
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
        </StyledToolbar>
      </AppBar>
    </Box>
  );
};
