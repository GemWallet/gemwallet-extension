import { FC, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import QRCode from 'qrcode.react';

import { HEADER_HEIGHT, NAV_MENU_HEIGHT } from '../../../constants';
import { useWallet } from '../../../contexts';
import { Header, NavMenu } from '../../organisms';

const MARGIN_TOP_CONTAINER = 20;
const CONTAINER_HEIGHT_TAKEN = HEADER_HEIGHT + NAV_MENU_HEIGHT + MARGIN_TOP_CONTAINER;

export interface ReceiveQRCodeProps {
  title?: string;
}

export const ReceiveQRCode: FC<ReceiveQRCodeProps> = ({ children, title }) => {
  const { wallets, selectedWallet } = useWallet();
  const publicAddress = wallets[selectedWallet].publicAddress;

  const [isCopied, setIsCopied] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicAddress);
      setIsCopied(true);
      const id = setTimeout(() => setIsCopied(false), 3000);
      setTimeoutId(id);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const abbreviateAddress = (address: string, maxLength = 8) => {
    if (address.length <= maxLength) return address;
    const halfLength = Math.floor(maxLength / 2);
    return address.slice(0, halfLength) + '...' + address.slice(-halfLength);
  };

  if (!wallets?.[selectedWallet]) {
    return null;
  }

  return (
    <>
      <Header wallet={wallets[selectedWallet]} />
      <Container
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: `calc(100vh - ${CONTAINER_HEIGHT_TAKEN}px)`,
          margin: `${MARGIN_TOP_CONTAINER}px auto 0 auto`,
          overflowY: 'auto'
        }}
      >
        {title && (
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            {title}
          </Typography>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px'
          }}
        >
          <div
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
          >
            <QRCode value={publicAddress} size={220} level="M" />
          </div>
          <Typography
            variant="body1"
            style={{
              margin: '10px'
            }}
          >
            {abbreviateAddress(publicAddress)}
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
        {children}
      </Container>
      <NavMenu />
    </>
  );
};

export default ReceiveQRCode;
