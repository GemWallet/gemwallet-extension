import React, { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { AppBar, IconButton, List, Toolbar, Typography } from '@mui/material';

import { NFTData } from '@gemwallet/constants';

import { NFTImage, NFTListItem } from '../../atoms';

interface NFTDetailsProps {
  NFTData: NFTData;
  handleClose: () => void;
}

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
      <List sx={{ width: '100%', wordBreak: 'break-word' }}>
        <NFTImage imageURL={NFTData.image} />
        <NFTListItem primary="Token ID" secondary={NFTData.NFTokenID} />
        <NFTListItem primary="Name" secondary={NFTData.name} />
        <NFTListItem primary="Description" secondary={NFTData.description} />
      </List>
    </>
  );
};
