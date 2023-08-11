import React, { FC } from 'react';

import { ListItem, ListItemText } from '@mui/material';

interface NFTListItemProps {
  primary: string;
  secondary?: string;
}

export const NFTListItem: FC<NFTListItemProps> = ({ primary, secondary }) => {
  if (!secondary) return null;

  return (
    <ListItem style={{ padding: '8px 24px' }}>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  );
};
