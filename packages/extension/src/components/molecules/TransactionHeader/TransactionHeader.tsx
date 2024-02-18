import { FC, useMemo } from 'react';

import { Avatar, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';

export interface TransactionHeaderProps {
  title: string;
  favicon?: string;
  url?: string | null;
}

export const TransactionHeader: FC<TransactionHeaderProps> = ({ title, favicon, url }) => {
  const titleStyle = useMemo(
    () => ({
      marginLeft: favicon ? '10px' : '0px'
    }),
    [favicon]
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {favicon ? (
        <Avatar src={favicon} sx={{ bgcolor: '#2b2b2b', padding: '6px' }} variant="rounded" />
      ) : null}
      <div style={titleStyle}>
        <Typography
          variant="h6"
          component="h1"
          style={{ fontSize: '1.5rem', lineHeight: '1.2' }}
          data-testid="page-title"
        >
          {title}
        </Typography>
        {url ? (
          <Typography
            component="h2"
            style={{
              color: SECONDARY_GRAY,
              fontSize: '0.9rem',
              overflow: 'hidden'
            }}
          >
            {url}
          </Typography>
        ) : null}
      </div>
    </div>
  );
};
