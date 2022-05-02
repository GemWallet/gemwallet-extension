import MUIDrawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { useDrawer } from '../../../contexts/DrawerContext';

const items = [
  {
    name: 'Help'
  },
  {
    name: 'Leave A Feedback'
  },
  {
    name: 'Reset Secret Phrase'
  },
  {
    name: 'About'
  }
];

export const Drawer = () => {
  const { isOpen, openDrawer } = useDrawer();

  const handleClose = () => {
    openDrawer(false);
  };

  return (
    <MUIDrawer anchor="right" open={isOpen} onClose={handleClose}>
      <Box style={{ width: '100vw' }} role="presentation">
        <div
          style={{
            padding: '0.75rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6">Settings</Typography>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {items.map(({ name }) => (
            <ListItem button key={name}>
              <ListItemText primary={name} />
              <ListItemIcon>
                <NavigateNextIcon />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            margin: '1.5rem'
          }}
        >
          <Button variant="contained" fullWidth size="large">
            Lock
          </Button>
        </div>
      </Box>
    </MUIDrawer>
  );
};
