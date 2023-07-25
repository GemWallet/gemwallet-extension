import React, { useState } from 'react';

import { Typography, Button } from '@mui/material';
import QrCode from 'react-qr-code';

// Import the headerStyles from Header.tsx

interface ReceiveQRCodeProps {
  publicAddress: string;
}

const ReceiveQRCode: React.FC<ReceiveQRCodeProps> = ({ publicAddress }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAddress = () => {
    // Your logic to copy the publicAddress to the clipboard
    // You can use the `copy-to-clipboard` library or other methods for this.
    setIsCopied(true);
    // Reset the copied status after a certain timeout
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Function to abbreviate the wallet address
  const abbreviateAddress = (address: string, maxLength = 8) => {
    if (address.length <= maxLength) return address;
    const halfLength = Math.floor(maxLength / 2);
    return address.slice(0, halfLength) + '...' + address.slice(-halfLength);
  };

  return (
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
        onClick={handleCopyAddress}
        style={{ marginTop: '10px' }}
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  );
};

export default ReceiveQRCode;
