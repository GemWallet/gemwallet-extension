import { FC, useContext, useEffect, useState } from 'react';

import { AccountNFTokenResponse } from '@gemwallet/constants';

import { LedgerContext } from '../../../contexts';
import { NftListing } from '../../organisms/NftListing';
import { PageWithHeader } from '../../templates';

const initalState = {
  account_nfts: [],
  marker: null
};

export const Nfts: FC = () => {
  const { getNFTs } = useContext(LedgerContext);

  const [nfts, setNfts] = useState<AccountNFTokenResponse>(initalState);

  const fetchNfts = async () => {
    try {
      const payload = {
        limit: 20,
        marker: nfts.marker
      };

      if (!nfts.marker) {
        delete payload.marker;
      }

      const response = await getNFTs(payload);

      setNfts({
        marker: response.marker,
        account_nfts: nfts.account_nfts.concat(response.account_nfts)
      });
    } catch (error) {
      setNfts(initalState);
    }
  };

  useEffect(() => {
    fetchNfts();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to fetch once
  }, []);

  return (
    <PageWithHeader>
      <NftListing {...{ ...nfts, onLoadMoreClick: fetchNfts }} />
    </PageWithHeader>
  );
};
