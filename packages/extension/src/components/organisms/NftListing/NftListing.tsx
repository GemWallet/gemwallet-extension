import { FC } from 'react';

import { List } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

import { AccountNFTokenResponse } from '@gemwallet/constants';

import { InformationMessage } from '../../molecules';
import { NftCard } from '../../molecules/NftCard';

export interface NftListingProps extends AccountNFTokenResponse {
  onLoadMoreClick: () => void;
}

export const NftListing: FC<NftListingProps> = ({ account_nfts, marker, onLoadMoreClick }) => {
  if (account_nfts.length === 0) {
    return (
      <InformationMessage title="No NFTs to show">
        <div style={{ marginBottom: '5px' }}>There are no NFTs found in this wallet.</div>
      </InformationMessage>
    );
  }

  return (
    <InfiniteScroll
      dataLength={account_nfts.length}
      next={onLoadMoreClick}
      hasMore={true}
      height={450}
      loader={<h4>Loading...</h4>}
    >
      <List dense>
        {account_nfts.map((nft) => (
          <NftCard key={nft.NFTokenID} nft={nft} />
        ))}
      </List>
    </InfiniteScroll>
  );
};
