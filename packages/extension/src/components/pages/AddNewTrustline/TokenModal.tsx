import { FC } from 'react';

import { Modal, List, ListItem, ListItemText, ListItemAvatar, Avatar, Box } from '@mui/material';

import { convertHexCurrencyString } from '../../../utils';

export interface TokenData {
  name: string;
  icon: string;
  currency: string;
  issuer: string;
}

interface TokenModalProps {
  open: boolean;
  tokens: TokenData[];
  onClose: () => void;
  onSelectToken: (token: TokenData) => void;
}

export const TokenModal: FC<TokenModalProps> = ({ open, tokens, onClose, onSelectToken }) => {
  const safeConvertHexCurrencyString = (currency: string): string => {
    try {
      return convertHexCurrencyString(currency);
    } catch (error) {
      return currency; // fallback to the original value in case of error
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        style={{
          maxHeight: '300px',
          width: '300px',
          backgroundColor: '#272727',
          borderRadius: '10px',
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 'none',
          overflow: 'auto',
          color: 'white'
        }}
      >
        {tokens.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            padding="20px 0"
          >
            No data found
          </Box>
        ) : (
          <List style={{ maxHeight: '280px', overflow: 'auto' }}>
            {tokens.map((token, index) => (
              <ListItem button key={index} onClick={() => onSelectToken(token)}>
                <ListItemAvatar>
                  <Avatar src={token.icon} alt={`${token.currency} icon`} />
                </ListItemAvatar>
                <ListItemText
                  primary={safeConvertHexCurrencyString(token.currency)}
                  primaryTypographyProps={{ style: { color: 'white' } }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};
