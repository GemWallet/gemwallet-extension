import React, { FC } from 'react';

import { CircularProgress } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { GemWallet } from '../index';

interface NFTImageProps {
  imageURL?: string;
  height?: number;
  width?: number;
}

export const NFTImage: FC<NFTImageProps> = ({ imageURL, height = 250, width = 250 }) => {
  return imageURL ? (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LazyLoadImage
        alt="NFT"
        height={height}
        style={{ borderRadius: '4px', boxShadow: '4px 4px 0px black' }}
        beforeLoad={() => <CircularProgress />}
        effect="blur"
        src={imageURL}
        width={width}
      />
    </div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <GemWallet />
    </div>
  );
};
