import { FC, useContext, useEffect, useState } from 'react';

import { AccountNFTokenResponse } from '@gemwallet/constants';

import { LedgerContext } from '../../../contexts';
import { NFTListing } from '../../organisms';
import { PageWithHeader } from '../../templates';

export const MAX_FETCHED_NFTS = 20;

const initalState = {
  account_nfts: [],
  marker: null,
  loading: false
};

interface NFTsProps extends AccountNFTokenResponse {
  loading: boolean;
}

export const NFTs: FC = () => {
  const { getNFTs } = useContext(LedgerContext);

  const [NFTs, setNFTs] = useState<NFTsProps>(initalState);

  const fetchNFTs = async () => {
    try {
      const payload = {
        limit: MAX_FETCHED_NFTS,
        marker: NFTs.marker ?? undefined
      };

      setNFTs({ ...NFTs, loading: true });

      const response = await getNFTs(payload);

      setNFTs({
        marker: response.marker,
        account_nfts: NFTs.account_nfts.concat(response.account_nfts),
        loading: false
      });
    } catch (error) {
      setNFTs(initalState);
    }
  };

  useEffect(() => {
    fetchNFTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to fetch once
  }, []);

  return (
    <PageWithHeader>
      <NFTListing
        {...{
          ...NFTs,
          onLoadMoreClick: fetchNFTs
        }}
      />
    </PageWithHeader>
  );
};
