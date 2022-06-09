import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';
import { styled } from '@mui/material/styles';
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { NetworkIndicator } from '../../molecules/NetworkIndicator';
import { WalletIcon } from '../../atoms';
import { truncateAddress } from '../../../utils';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'block',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    height: 70
  }
}));

const resetTimeout = (timeoutReference: NodeJS.Timeout | null) => {
  if (timeoutReference) {
    clearTimeout(timeoutReference);
  }
};

export const Header: FC = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    return () => resetTimeout(timerRef.current);
  }, []);

  const publicAddress = 'rJxoHDLrT1soHXLJ6uwMs5opms1kuiUEdN';
  const truncatedAddress = useMemo(() => truncateAddress(publicAddress), [publicAddress]);

  const handleShare = useCallback(() => {
    resetTimeout(timerRef.current);
    copyToClipboard(publicAddress);
    setIsCopied(true);
    timerRef.current = setTimeout(() => setIsCopied(false), 2000);
  }, []);

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
            <WalletIcon publicAddress={publicAddress} />
            <NetworkIndicator />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" style={{ margin: '10px 0' }}>
              {truncatedAddress}
            </Typography>
            <Tooltip title="Copy your public address">
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
                  <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
};
