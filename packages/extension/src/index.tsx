import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import { BrowserProvider, LedgerProvider, ServerProvider } from './contexts';
import reportWebVitals from './reportWebVitals';
import './index.css';

const theme = createTheme({
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
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Paper style={{ height: '100vh', width: '100vw' }}>
        <BrowserRouter>
          <BrowserProvider>
            <LedgerProvider>
              <ServerProvider>
                <App />
              </ServerProvider>
            </LedgerProvider>
          </BrowserProvider>
        </BrowserRouter>
      </Paper>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
