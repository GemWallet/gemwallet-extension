import React from 'react';
import ReactDOM from 'react-dom';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import { LedgerProvider } from './contexts/LedgerContext';
import { BrowserProvider } from './contexts/BrowserContext';
import reportWebVitals from './reportWebVitals';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Paper style={{ height: '100vh', width: '100vw' }}>
        <BrowserProvider>
          <LedgerProvider>
            <App />
          </LedgerProvider>
        </BrowserProvider>
      </Paper>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
