import { FC } from 'react';

import { List, ListItem, ListItemText } from '@mui/material';

import { NFTData } from '@gemwallet/constants';

import { NFTImage } from '../../atoms';

interface NFTDetailsProps {
  NFTData: NFTData;
}

const listItemStyle = { padding: '8px 24px' };

export const NFTDetails: FC<NFTDetailsProps> = ({ NFTData }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <NFTImage imageURL={NFTData.image} style={{ marginTop: 30 }} pulseDuration={0.6} />
      </div>
      <List sx={{ width: '100%', wordBreak: 'break-word' }}>
        <ListItem style={listItemStyle}>
          <ListItemText primary="Token ID" secondary={NFTData.NFTokenID} />
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
