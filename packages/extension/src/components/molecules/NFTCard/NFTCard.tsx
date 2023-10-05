import { FC, useCallback, useEffect, useState } from 'react';

import { CircularProgress, Paper } from '@mui/material';
import * as Sentry from '@sentry/react';
import { convertHexToString } from 'xrpl';

import { AccountNFToken, NFTData } from '@gemwallet/constants';

import { useLedger } from '../../../contexts';
import { NFTImage, TruncatedText } from '../../atoms';
import { NFTDetails } from '../../organisms';
import { DialogPage } from '../../templates';

export type NFTCardLayout = 'large' | 'small' | 'list';

export interface NFTCardProps {
  NFT: AccountNFToken;
  layout: NFTCardLayout;
}

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

  if (!NFTData) return null;

  return (
    <>
      <DialogPage title="NFT Details" open={dialogOpen} onClose={handleCloseDialog}>
        <NFTDetails NFTData={NFTData} />
      </DialogPage>
      <Paper
        data-testid="nft-card"
        elevation={5}
        style={{
          maxWidth: '100%',
          width: layout === 'large' ? '90%' : layout === 'small' ? '40%' : '90%',
          padding: layout === 'large' ? '10px' : layout === 'list' ? '16px' : '14px',
          display: 'flex',
          flexDirection: layout === 'list' ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px',
          cursor: 'pointer'
        }}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
          }
        }}
        onClick={handleViewNFTClick}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
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
                <div
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    color: 'grey'
                  }}
                >
                  <TruncatedText sx={{ fontSize: '14px' }}>{NFTData.NFTokenID}</TruncatedText>
                </div>
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

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  color: 'grey',
                  marginTop: '10px'
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
            </>
          ) : null}
        </div>
      </Paper>
    </>
  );
};
