import { CSSProperties, FC } from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Paper, Typography } from '@mui/material';

export interface InformationMessageProps {
  title?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

export const InformationMessage: FC<InformationMessageProps> = ({ title, children, style }) => {
  return (
    <Paper
      elevation={5}
      style={{
        padding: '10px',
        ...style
      }}
    >
      {title ? (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <InfoOutlinedIcon fontSize="small" />
          <Typography variant="body2" style={{ marginLeft: '3px', textTransform: 'uppercase' }}>
            {title}
          </Typography>
        </div>
      ) : null}
      <Typography variant="body1" variantMapping={{ body1: 'div' }}>
        {children}
      </Typography>
    </Paper>
  );
};
