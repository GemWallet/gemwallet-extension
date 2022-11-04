import { CSSProperties, FC } from 'react';

import ContentLoader from 'react-content-loader';

export interface TileLoaderProps {
  width?: number;
  height?: number;
  style?: CSSProperties;
  firstLineOnly?: boolean;
  secondLineOnly?: boolean;
  fwidth?: number;
  swidth?: number;
}

export const TileLoader: FC<TileLoaderProps> = ({
  width = 305,
  height = 50,
  style,
  firstLineOnly = false,
  secondLineOnly = false,
  fwidth,
  swidth,
  ...props
}) => {
  let calculatedHeight = height;
  if (firstLineOnly || secondLineOnly) {
    calculatedHeight = 15;
  }
  return (
    <ContentLoader
      speed={2}
      width={width}
      height={calculatedHeight}
      viewBox={`0 0 ${width} ${calculatedHeight}`}
      backgroundColor="#515151"
      foregroundColor="#898787"
      style={{
        marginTop: '15px',
        ...style
      }}
      {...props}
    >
      {!secondLineOnly && <rect x="0" y="0" rx="3" ry="3" width={fwidth || 88} height="11" />}
      {!firstLineOnly && (
        <rect
          x={swidth ? 41 + 260 - swidth : 41}
          y={secondLineOnly ? '0' : '23'}
          rx="3"
          ry="3"
          width={swidth || 260}
          height="11"
        />
      )}
    </ContentLoader>
  );
};
