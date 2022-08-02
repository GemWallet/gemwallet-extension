import { FC } from 'react';
import { Paper } from '@mui/material';
import ContentLoader from 'react-content-loader';

export const TokenLoader: FC = () => {
  return (
    <Paper
      elevation={5}
      style={{
        padding: '10px 10px 2px 10px'
      }}
    >
      <ContentLoader
        speed={2}
        width={325}
        height={50}
        viewBox="0 0 325 50"
        backgroundColor="#515151"
        foregroundColor="#898787"
      >
        <rect x="60" y="7" rx="3" ry="3" width="52" height="10" />
        <rect x="60" y="28" rx="3" ry="3" width="200" height="10" />
        <circle cx="23" cy="23" r="23" />
      </ContentLoader>{' '}
    </Paper>
  );
};
