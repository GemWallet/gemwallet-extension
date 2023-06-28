import { FC, forwardRef, useCallback, useContext, useEffect, useState } from 'react';

import { OpenInNewOutlined } from '@mui/icons-material';
import { Button, CircularProgress, Dialog, ListItem, Paper, Slide, Tooltip } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { AccountNFToken, NFTData } from '@gemwallet/constants';

import { LedgerContext } from '../../../contexts';
import { GemWallet } from '../../atoms';
import { NFTDetails } from '../../organisms';

export interface NFTCardProps {
  NFT: AccountNFToken;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const NFTCard: FC<NFTCardProps> = ({ NFT }) => {
  const { getNFTData } = useContext(LedgerContext);
  const [NFTData, setNFTData] = useState<NFTData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleViewNFTClick = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  useEffect(() => {
    const fetchNFTImg = async () => {
      try {
        setLoading(true);
        const nftData = await getNFTData({ NFT });
        setNFTData(nftData);
      } catch (error) {
        setNFTData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNFTImg();
  }, [getNFTData, NFT]);

  const handleTokenIdClick = (tokenId: string) => {
    navigator.clipboard.writeText(tokenId);
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullScreen
        TransitionComponent={Transition}
      >
        {NFTData && <NFTDetails NFTData={NFTData} handleClose={handleCloseDialog} />}
      </Dialog>
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
            <CircularProgress data-testid="progressbar" />
          ) : NFTData?.image ? (
            <LazyLoadImage
              alt="nft"
              height={150}
              style={{ borderRadius: '4px', boxShadow: '4px 4px 0px black' }}
              beforeLoad={() => <CircularProgress />}
              effect="blur"
              src={NFTData?.image}
              width={150}
            />
          ) : (
            <GemWallet />
          )}
          {NFTData ? (
            <Tooltip title={NFTData.NFTokenID}>
              <div
                style={{ fontSize: '14px', color: 'grey', marginTop: '10px', cursor: 'pointer' }}
                onClick={() => handleTokenIdClick(NFTData.NFTokenID)}
              >
                {NFTData.NFTokenID.substring(0, 10) + '...'}
              </div>
            </Tooltip>
          ) : null}
          {NFTData?.name ? (
            <div
              style={{ fontSize: '16px', color: 'white', marginTop: '10px' }}
              data-testid="nft_name"
            >
              {NFTData.name}
            </div>
          ) : null}
          {NFTData?.description ? (
            <div style={{ fontSize: '14px', color: 'grey', marginTop: '10px' }}>
              {NFTData.description}
            </div>
          ) : null}
          <Button
            variant="outlined"
            style={{ marginTop: '10px', fontSize: '14px', gap: '10px' }}
            onClick={handleViewNFTClick}
          >
            View <OpenInNewOutlined style={{ fontSize: '16px' }} />
          </Button>
        </ListItem>
      </Paper>
    </>
  );
};
