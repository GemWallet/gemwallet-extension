import React, { useMemo } from 'react';

import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { BrowserRouter } from 'react-router-dom';

import { POPUP_HEIGHT, POPUP_WIDTH } from '../../../constants';
import {
  BrowserProvider,
  LedgerProvider,
  NavBarPositionProvider,
  NetworkProvider,
  ServerProvider,
  TransactionProgressProvider,
  WalletProvider
} from '../../../contexts';
import App from '../../../App';

export const GemWallet = () => {
  const theme = useMemo(
    () =>
      createTheme({
        ...{
          palette: {
            mode: 'dark'
          },
          components: {
            MuiBottomNavigation: {
              styleOverrides: {
                root: {
                  backgroundColor: 'transparent',
                  borderTop: 'solid 1px #bcbcbc'
                }
              }
            },
            MuiBottomNavigationAction: {
              styleOverrides: {
                root: {
                  '&.Mui-selected': {
                    color: '#ffffff'
                  }
                }
              }
            }
          }
        }
      }),
    []
  );

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Paper style={{ height: POPUP_HEIGHT - 20, width: POPUP_WIDTH }}>
          <BrowserRouter>
            <BrowserProvider>
              <WalletProvider>
                <NetworkProvider>
                  <LedgerProvider>
                    <ServerProvider>
                      <TransactionProgressProvider>
                        <NavBarPositionProvider>
                          <App />
                        </NavBarPositionProvider>
                      </TransactionProgressProvider>
                    </ServerProvider>
                  </LedgerProvider>
                </NetworkProvider>
              </WalletProvider>
            </BrowserProvider>
          </BrowserRouter>
        </Paper>
      </ThemeProvider>
    </React.StrictMode>
  );
};
