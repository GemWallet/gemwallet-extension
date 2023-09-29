import { FC, useCallback, useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { IconButton, List, ListItem, ListItemText, Tooltip } from '@mui/material';
import copyToClipboard from 'copy-to-clipboard';

import { NFTData } from '@gemwallet/constants';

import { NFTImage } from '../../atoms';

interface NFTDetailsProps {
  NFTData: NFTData;
}

const listItemStyle = { padding: '8px 24px' };

export const NFTDetails: FC<NFTDetailsProps> = ({ NFTData }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    copyToClipboard(NFTData.NFTokenID);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // 2 seconds
  }, [NFTData.NFTokenID]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <NFTImage imageURL={NFTData.image} style={{ marginTop: 30 }} pulseDuration={0.6} />
      </div>
      <List sx={{ width: '100%', wordBreak: 'break-word' }}>
        <ListItem style={listItemStyle}>
          <ListItemText primary="Token ID" secondary={NFTData.NFTokenID} />
          <Tooltip title="Copy the Token ID">
            <IconButton
              size="small"
              edge="end"
              color="inherit"
              aria-label="Copy"
              onClick={handleCopy}
            >
              {isCopied ? (
                <DoneIcon sx={{ fontSize: '1rem' }} color="success" />
              ) : (
                <ContentCopyIcon sx={{ fontSize: '1rem' }} />
              )}
            </IconButton>
          </Tooltip>
        </ListItem>
        <ListItem style={listItemStyle}>
          <ListItemText primary="Name" secondary={NFTData.name ?? 'No data'} />
        </ListItem>
        <ListItem style={listItemStyle}>
          <ListItemText primary="Description" secondary={NFTData.description ?? 'No data'} />
        </ListItem>
      </List>
    </>
  );
};
