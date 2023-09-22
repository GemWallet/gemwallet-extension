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
  layout: 'large' | 'small';
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const NFTCard: FC<NFTCardProps> = ({ NFT, layout }) => {
  const { getNFTData } = useLedger();
  const [NFTData, setNFTData] = useState<NFTData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNFTData = async () => {
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
    fetchNFTData();
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
          width: layout === 'large' ? '90%' : '40%',
          padding: layout === 'large' ? '10px' : '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px'
        }}
      >
        <ListItem
          key={NFT.NFTokenID}
          style={{
            flexDirection: 'column',
            textAlign: 'center',
            width: '100%'
          }}
        >
          {isLoading ? (
            <CircularProgress data-testid="progressbar" />
          ) : (
            <NFTImage
              imageURL={NFTData.image}
              height={layout === 'large' ? 150 : 120}
              width={layout === 'large' ? 150 : 120}
            />
          )}
          <Tooltip title={NFTData.NFTokenID || ''}>
            <div
              onClick={() => handleTokenIdClick(NFTData.NFTokenID || '')}
              style={{
                display: 'block',
                maxWidth: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                color: 'grey',
                marginTop: '10px',
                cursor: 'pointer'
              }}
            >
              <TruncatedText sx={{ fontSize: layout === 'small' ? '12px' : undefined }}>
                {NFTData.NFTokenID}
              </TruncatedText>
            </div>
          </Tooltip>
          <TruncatedText
            sx={{
              fontSize: layout === 'small' ? '12px' : '16px',
              color: 'white',
              marginTop: layout === 'large' ? '10px' : '4px'
            }}
            data-testid="nft_name"
          >
            {NFTData.name}
          </TruncatedText>
          {layout === 'large' ? (
            <TruncatedText
              sx={{ fontSize: '14px', color: 'grey', marginTop: '10px' }}
              isMultiline={true}
            >
              {NFTData.description}
            </TruncatedText>
          ) : null}
          <Button
            variant="outlined"
            style={{
              marginTop: '10px',
              fontSize: layout === 'large' ? '14px' : '10px'
            }}
            onClick={handleViewNFTClick}
          >
            View <OpenInNewOutlined style={{ fontSize: layout === 'large' ? '16px' : '12px' }} />
          </Button>
        </ListItem>
      </Paper>
    </>
  );
};
