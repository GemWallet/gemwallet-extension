import { FC, useContext, useEffect, useState } from 'react';

import { AccountNFTokenResponse } from '@gemwallet/constants';

import { LedgerContext } from '../../../contexts';
import { NftListing } from '../../organisms/NftListing';
import { PageWithHeader } from '../../templates';

const initalState = {
  account_nfts: [],
  marker: null,
  loading: false
};

interface NftsProps extends AccountNFTokenResponse {
  loading: boolean;
}

export const Nfts: FC = () => {
  const { getNFTs } = useContext(LedgerContext);

  const [nfts, setNfts] = useState<NftsProps>(initalState);

  const fetchNfts = async () => {
    try {
      const payload = {
        limit: 20,
        marker: nfts.marker ?? undefined
      };

      setNfts({ ...nfts, loading: true });

      const response = await getNFTs(payload);

      setNfts({
        marker: response.marker,
        account_nfts: nfts.account_nfts.concat(response.account_nfts),
        loading: false
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
