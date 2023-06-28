import React, { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { NFTData } from '@gemwallet/constants';

import { GemWallet } from '../../atoms';

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
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            NFT Details
          </Typography>
        </Toolbar>
      </AppBar>
      <List sx={{ width: '100%', wordBreak: 'break-word' }}>
        {NFTData.image ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LazyLoadImage
              alt="nft"
              height={250}
              style={{ borderRadius: '4px', boxShadow: '4px 4px 0px black' }}
              beforeLoad={() => <CircularProgress />}
              effect="blur"
              src={NFTData?.image}
              width={250}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <GemWallet />
          </div>
        )}
        <ListItem style={{ padding: '8px 24px' }}>
          <ListItemText primary="Token ID" secondary={NFTData.NFTokenID} />
        </ListItem>
        {NFTData.name ? (
          <ListItem style={{ padding: '8px 24px' }}>
            <ListItemText primary="Name" secondary={NFTData.name} />
          </ListItem>
        ) : null}
        {NFTData.description ? (
          <ListItem style={{ padding: '8px 24px' }}>
            <ListItemText primary="Description" secondary={NFTData.description} />
          </ListItem>
        ) : null}
      </List>
    </>
  );
};
