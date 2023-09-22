import { FC, useState } from 'react';

import ListAltIcon from '@mui/icons-material/ListAlt';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { List, IconButton, Tooltip } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

import { AccountNFTokenResponse } from '@gemwallet/constants';

import { InformationMessage } from '../../molecules';
import { NFTCard } from '../../molecules';
import { MAX_FETCHED_NFTS } from '../../pages';

export interface NFTListingProps extends AccountNFTokenResponse {
  onLoadMoreClick: () => void;
  isLoading: boolean;
}

export const NFTListing: FC<NFTListingProps> = ({ isLoading, account_nfts, onLoadMoreClick }) => {
  const [layout, setLayout] = useState<'large' | 'small' | 'list'>('large');

  if (account_nfts.length === 0 && !isLoading) {
    return (
      <InformationMessage title="No NFTs to show">
        <div style={{ marginBottom: '5px' }}>There are no NFTs found in this wallet.</div>
      </InformationMessage>
    );
  }

  return (
    <div style={{ position: 'relative', top: '-5px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title="Large Layout">
          <IconButton
            size="small"
            onClick={() => setLayout('large')}
            color={layout === 'large' ? 'primary' : 'default'}
          >
            <ZoomOutMapIcon style={{ fontSize: '16px' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Small Layout">
          <IconButton
            size="small"
            onClick={() => setLayout('small')}
            color={layout === 'small' ? 'primary' : 'default'}
          >
            <PhotoSizeSelectSmallIcon style={{ fontSize: '16px' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="List Layout">
          <IconButton
            size="small"
            onClick={() => setLayout('list')}
            color={layout === 'list' ? 'primary' : 'default'}
          >
            <ListAltIcon style={{ fontSize: '16px' }} />
          </IconButton>
        </Tooltip>
      </div>
      <InfiniteScroll
        dataLength={account_nfts.length}
        next={onLoadMoreClick}
        hasMore={account_nfts.length >= MAX_FETCHED_NFTS}
        height={450}
        loader={<h4>Loading...</h4>}
      >
        <List dense style={{ paddingTop: 0 }}>
          <div
            style={{
              display: layout === 'list' ? 'block' : 'flex',
              flexWrap: 'wrap',
              justifyContent: layout === 'large' ? 'center' : 'space-between'
            }}
          >
            {account_nfts.map((NFT, index) => (
              <NFTCard key={index} NFT={NFT} layout={layout} />
            ))}
          </div>
        </List>
      </InfiniteScroll>
    </div>
  );
};
