import { FC, forwardRef, ReactElement, Ref, useCallback, useEffect, useState } from 'react';

import { OpenInNewOutlined } from '@mui/icons-material';
import { Button, CircularProgress, Dialog, Paper, Slide, Tooltip } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as Sentry from '@sentry/react';
import { convertHexToString } from 'xrpl';

import { AccountNFToken, NFTData } from '@gemwallet/constants';

import { useLedger } from '../../../contexts';
import { NFTImage, TruncatedText } from '../../atoms';
import { NFTDetails } from '../../organisms';

export interface NFTCardProps {
  NFT: AccountNFToken;
  layout: 'large' | 'small' | 'list';
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const NFTCard: FC<NFTCardProps> = ({ NFT, layout = 'large' }) => {
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
          maxWidth: '100%',
          width: layout === 'large' ? '90%' : layout === 'small' ? '40%' : '90%',
          padding: layout === 'large' ? '10px' : layout === 'list' ? '16px' : '14px',
          display: 'flex',
          flexDirection: layout === 'list' ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px'
        }}
      >
        {/* Details for 'list' layout */}
        {layout === 'list' ? (
          <div
            onClick={handleViewNFTClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            {/* NFT Image */}
            {isLoading ? (
              <CircularProgress data-testid="progressbar" />
            ) : (
              <NFTImage
                imageURL={NFTData.image}
                height={60}
                width={60}
                style={{ marginRight: '20px' }}
                fallbackScale={1}
              />
            )}

            <div style={{ width: 'calc(100% - 80px)', maxWidth: 'calc(100% - 80px)' }}>
              <Tooltip title={NFTData.NFTokenID || ''}>
                <div
                  onClick={(e) => {
                    handleTokenIdClick(NFTData.NFTokenID || '');
                    e.stopPropagation(); // Prevents the parent div's onClick from being triggered
                  }}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    color: 'grey',
                    cursor: 'pointer'
                  }}
                >
                  <TruncatedText sx={{ fontSize: '14px' }}>{NFTData.NFTokenID}</TruncatedText>
                </div>
              </Tooltip>
              <TruncatedText
                isMultiline={true}
                maxLines={'1'}
                sx={{ color: 'white', fontSize: '14px' }}
                data-testid="nft_name"
              >
                {NFTData.name}
              </TruncatedText>
            </div>
          </div>
        ) : null}

        {/* Details for 'large' and 'small' layouts */}
        {layout !== 'list' ? (
          <>
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
                  display: 'flex',
                  justifyContent: 'center',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  color: 'grey',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}
              >
                <TruncatedText
                  sx={{
                    fontSize: layout === 'small' ? '12px' : '14px',
                    textAlign: 'center',
                    maxWidth: '90%'
                  }}
                >
                  {NFTData.NFTokenID}
                </TruncatedText>
              </div>
            </Tooltip>
            <TruncatedText
              sx={{
                fontSize: layout === 'small' ? '12px' : '16px',
                color: 'white',
                marginTop: layout === 'large' ? '10px' : '4px',
                textAlign: 'center'
              }}
              data-testid="nft_name"
            >
              {NFTData.name}
            </TruncatedText>
            {layout === 'large' && (
              <TruncatedText
                sx={{ fontSize: '14px', color: 'grey', marginTop: '10px', textAlign: 'center' }}
                isMultiline={true}
              >
                {NFTData.description}
              </TruncatedText>
            )}
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
          </>
        ) : null}
      </Paper>
    </>
  );
};
