import { CSSProperties, FC } from 'react';

import { Button, Paper, Typography } from '@mui/material';

export interface TrustedAppProps {
  url: string;
  onRevokeClick: (url: string) => void;
  style?: CSSProperties;
}

export const TrustedApp: FC<TrustedAppProps> = ({ url, onRevokeClick, style }) => {
  return (
    <Paper
      elevation={5}
      style={{
        padding: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style
      }}
    >
      <div>
        <Typography>{url}</Typography>
      </div>
      <div>
        <Button fullWidth variant="contained" color="error" onClick={() => onRevokeClick(url)}>
          Revoke
        </Button>
      </div>
    </Paper>
  );
};
