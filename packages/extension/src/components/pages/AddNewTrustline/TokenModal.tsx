import { FC } from 'react';

import {
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Typography
} from '@mui/material';

import { convertHexCurrencyString } from '../../../utils';

const safeConvertHexCurrencyString = (currency: string): string => {
  try {
    return convertHexCurrencyString(currency);
  } catch (error) {
    return currency; // fallback to the original value in case of error
  }
};

export interface TokenData {
  name: string;
  icon: string;
  currency: string;
  issuer: string;
  issuerName: string;
  issuerIcon: string;
}

export interface TokenModalProps {
  open: boolean;
  tokens: TokenData[];
  onClose: () => void;
  onSelectToken: (token: TokenData) => void;
}

export const TokenModal: FC<TokenModalProps> = ({ open, tokens, onClose, onSelectToken }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        style={{
          maxHeight: '300px',
          width: '300px',
          backgroundColor: '#272727',
          borderRadius: '10px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 'none',
          overflow: 'auto',
          color: 'white'
        }}
      >
        {tokens.length === 0 ? (
          <Typography
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            padding="20px 0"
            fontSize="16px"
          >
            No data found
          </Typography>
        ) : (
          <List style={{ maxHeight: '280px', overflow: 'auto' }}>
            {tokens.map((token, index) => (
              <ListItem button key={index} onClick={() => onSelectToken(token)}>
                <ListItemAvatar>
                  <Avatar src={token.icon} alt={`${token.currency} icon`} />
                </ListItemAvatar>
                <ListItemText
                  primary={safeConvertHexCurrencyString(token.currency)}
                  secondary={
                    <>
                      <span style={{ marginRight: '5px', verticalAlign: 'middle' }}>Issued by</span>
                      <Avatar
                        src={token.issuerIcon}
                        alt={`${token.issuerName} issuer logo`}
                        style={{
                          width: '20px',
                          height: '20px',
                          display: 'inline-block',
                          marginRight: '5px',
                          marginLeft: '5px',
                          verticalAlign: 'middle'
                        }}
                      />
                      <span style={{ verticalAlign: 'middle' }}>{token.issuerName}</span>
                    </>
                  }
                  primaryTypographyProps={{
                    style: {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: 'white'
                    }
                  }}
                  secondaryTypographyProps={{ component: 'div' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};
