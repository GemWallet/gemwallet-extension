import { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';

import { NFTData } from '@gemwallet/constants';

import { NFTImage } from '../../atoms';

interface NFTDetailsProps {
  NFTData: NFTData;
  handleClose: () => void;
}

const listItemStyle = { padding: '8px 24px' };

export const NFTDetails: FC<NFTDetailsProps> = ({ NFTData, handleClose }) => {
  return (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={handleClose}
            style={{ cursor: 'pointer' }}
            data-testid="close-button"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="p">
            NFT Details
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <NFTImage imageURL={NFTData.image} style={{ marginTop: 30 }} pulseDuration={1} />
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
