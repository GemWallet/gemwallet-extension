import React, { FC } from 'react';

import { Typography, Card, CardMedia } from '@mui/material';
import { Amount } from 'xrpl/dist/npm/models/common';

import { NFTData } from '@gemwallet/constants';

import { useMainToken } from '../../../hooks';
import { formatAmount } from '../../../utils';

export type TxNFTData = NFTData & {
  amount?: Amount; // For NFT offers
};

interface TransactionNFTDisplayProps {
  nftData: TxNFTData;
}

export const TransactionNFTDisplay: FC<TransactionNFTDisplayProps> = ({ nftData }) => {
  const mainToken = useMainToken();

  return (
    <>
      {nftData.amount ? (
        <Typography variant="body2" color="textSecondary">
          {formatAmount(nftData.amount, mainToken)}
        </Typography>
      ) : null}
      {nftData.name ? (
        <Typography
          variant="body2"
          color="textSecondary"
          style={{
            marginTop: '5px',
            fontWeight: 'lighter',
            fontStyle: 'italic',
            fontSize: '0.9em'
          }}
        >
          {nftData.name}
        </Typography>
      ) : null}
      {nftData.image ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <Card sx={{ maxWidth: 300 }}>
            <CardMedia component="img" height="140" image={nftData.image} alt="NFT Image" />
          </Card>
        </div>
      ) : null}
    </>
  );
};
