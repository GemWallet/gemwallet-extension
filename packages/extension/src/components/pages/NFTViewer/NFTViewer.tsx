import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import * as Sentry from '@sentry/react';

import { AccountNFTokenResponse } from '@gemwallet/constants';

import { navigation, NFT_VIEWER_PATH } from '../../../constants';
import { useLedger } from '../../../contexts';
import { NFTListing } from '../../organisms';
import { PageWithHeader } from '../../templates';

export const MAX_FETCHED_NFTS = 20;

const initialState = {
  account_nfts: [],
  marker: null,
  isLoading: false
};

interface NFTsProps extends AccountNFTokenResponse {
  isLoading: boolean;
}

export const NFTViewer: FC = () => {
  const { getNFTs } = useLedger();
  const [NFTs, setNFTs] = useState<NFTsProps>(initialState);

  const fetchNFTs = useCallback(async () => {
    try {
      const payload = {
        limit: MAX_FETCHED_NFTS,
        marker: NFTs.marker ?? undefined
      };

      setNFTs({ ...NFTs, isLoading: true });

      const response = await getNFTs(payload);

      setNFTs({
        marker: response.marker,
        account_nfts: NFTs.account_nfts.concat(response.account_nfts),
        isLoading: false
      });
    } catch (error) {
      setNFTs(initialState);
      Sentry.captureException(error);
    }
  }, [NFTs, getNFTs]);

  const indexDefaultNav = useMemo(
    () => navigation.findIndex((link) => link.pathname === NFT_VIEWER_PATH),
    []
  );

  useEffect(() => {
    fetchNFTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to fetch once
  }, []);

  return (
    <PageWithHeader indexDefaultNav={indexDefaultNav}>
      <NFTListing
        {...{
          ...NFTs,
          onLoadMoreClick: fetchNFTs
        }}
      />
    </PageWithHeader>
  );
};
