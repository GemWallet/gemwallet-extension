import { FC, useContext, useEffect, useState } from 'react';

import { CircularProgress, ListItem, Paper } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { AccountNFToken, NFTData } from '@gemwallet/constants';

import { LedgerContext } from '../../../contexts';

export interface NftCardProps {
  nft: AccountNFToken;
}

export const NftCard: FC<NftCardProps> = ({ nft }) => {
  const { getNFTData } = useContext(LedgerContext);
  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNftImg = async () => {
      try {
        setLoading(true);
        const nftData = await getNFTData({ nft });
        setNftData(nftData);
      } catch (error) {
        setNftData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNftImg();
  }, [getNFTData, nft]);

  return (
    <Paper
      elevation={5}
      style={{
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}
    >
      <ListItem
        style={{
          flexDirection: 'column',
          textAlign: 'center'
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <LazyLoadImage
            alt="nft"
            height={150}
            style={{ borderRadius: '4px', boxShadow: '4px 4px 0px black' }}
            beforeLoad={() => <CircularProgress />}
            effect="blur"
            src={nftData?.image} // use normal <img> attributes as props
            width={150}
          />
          //   <img src={nftData?.image} alt="nft" style={{ maxWidth: "150px", borderRadius: "10px", boxShadow: "4px 4px 0px black" }} />
        )}
        <div style={{ fontSize: '16px', color: 'white', marginTop: '10px' }}>{nftData?.name}</div>
        <div style={{ fontSize: '14px', color: 'grey', marginTop: '10px' }}>
          {nftData?.description}
        </div>
        {/* <Button variant="outlined" style={{ marginTop: '10px', fontSize: '14px', gap: '10px' }}>View <OpenInNewIcon style={{ fontSize: '16px' }} /></Button> */}
      </ListItem>
    </Paper>
  );
};
