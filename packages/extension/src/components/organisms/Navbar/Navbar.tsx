import { FC } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Logo } from '../../atoms/Logo';
import { NetworkIndicator } from '../../molecules/NetworkIndicator';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'flex-start',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    height: 70
  }
}));

export const Navbar: FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <StyledToolbar>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              marginRight: '20px'
            }}
          >
            <Logo />
          </div>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1, alignSelf: 'flex-end' }}
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            GemWallet
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end'
            }}
          >
            <NetworkIndicator />
          </div>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
};
