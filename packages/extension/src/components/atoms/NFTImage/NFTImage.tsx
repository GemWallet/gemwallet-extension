import { CSSProperties, FC } from 'react';

import { CircularProgress } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { GemWallet } from '../index';

import './NFTImage.css';

interface NFTImageProps {
  imageURL?: string;
  height?: number;
  width?: number;
  style?: CSSProperties;
  fallbackScale?: number;
}

export const NFTImage: FC<NFTImageProps> = ({
  imageURL,
  height = 250,
  width = 250,
  style,
  fallbackScale = 2
}) => {
  return imageURL ? (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...style }}>
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height,
        width,
        backgroundColor: '#1e1e1e',
        borderRadius: '4px',
        boxShadow: '4px 4px 0px black',
        ...style
      }}
    >
      <GemWallet style={{ transform: `scale(${fallbackScale}` }} />
    </div>
  );
};
