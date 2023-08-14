import { FC, forwardRef, ReactElement, Ref, useCallback, useEffect, useState } from 'react';

import { OpenInNewOutlined } from '@mui/icons-material';
import { Button, CircularProgress, Dialog, ListItem, Paper, Slide, Tooltip } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as Sentry from '@sentry/react';
import { convertHexToString } from 'xrpl';

import { AccountNFToken, NFTData } from '@gemwallet/constants';

import { useLedger } from '../../../contexts';
import { NFTImage, TruncatedText } from '../../atoms';
import { NFTDetails } from '../../organisms';

export interface NFTCardProps {
  NFT: AccountNFToken;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const NFTCard: FC<NFTCardProps> = ({ NFT }) => {
  const { getNFTData } = useLedger();
  const [NFTData, setNFTData] = useState<NFTData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNFTImg = async () => {
      try {
        setIsLoading(true);
        const nftData = await getNFTData({ NFT });
        setNFTData(nftData);
      } catch (error) {
        setNFTData({
          NFTokenID: NFT.NFTokenID,
          description: NFT.URI ? convertHexToString(NFT.URI) : 'No data'
        });
        Sentry.captureException(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNFTImg();
  }, [getNFTData, NFT]);

  const handleViewNFTClick = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleTokenIdClick = useCallback((tokenId: string) => {
    navigator.clipboard.writeText(tokenId);
  }, []);

  if (!NFTData) return null;

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullScreen
        TransitionComponent={Transition}
      >
        <NFTDetails NFTData={NFTData} handleClose={handleCloseDialog} />
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
          {isLoading ? (
            <CircularProgress data-testid="progressbar" />
          ) : (
            <NFTImage imageURL={NFTData.image} height={150} width={150} />
          )}
          <Tooltip title={NFTData.NFTokenID}>
            <TruncatedText
              onClick={() => handleTokenIdClick(NFTData.NFTokenID)}
              sx={{ fontSize: '14px', color: 'grey', marginTop: '10px', cursor: 'pointer' }}
            >
              {NFTData.NFTokenID}
            </TruncatedText>
          </Tooltip>
          <TruncatedText
            sx={{ fontSize: '16px', color: 'white', marginTop: '10px' }}
            data-testid="nft_name"
          >
            {NFTData.name}
          </TruncatedText>
          <TruncatedText
            sx={{ fontSize: '14px', color: 'grey', marginTop: '10px' }}
            isMultiline={true}
          >
            {NFTData.description}
          </TruncatedText>
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
