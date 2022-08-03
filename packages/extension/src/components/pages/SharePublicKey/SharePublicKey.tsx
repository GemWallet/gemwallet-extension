import { FC, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { PageWithTitle } from '../../templates';
import { SECONDARY_GRAY } from '../../../constants';

export const SharePublicKey: FC = () => {
  const website = { url: 'http://localhost:3000/', title: 'My great Store' };

  const handleReject = useCallback(() => {}, []);

  const handleConfirm = useCallback(() => {}, []);

  return (
    <PageWithTitle title="Share public key">
      <Paper
        elevation={24}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}
      >
        <Avatar src={`${new URL(website.url).origin}/favicon.ico`} variant="rounded" />
        <Typography variant="h6">{website.title}</Typography>
        <Typography style={{ color: SECONDARY_GRAY }}>{website.url}</Typography>
      </Paper>

      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">This app would like to:</Typography>
        <List>
          <ListItem>
            <CheckIcon color="success" />
            <ListItemText style={{ marginLeft: '10px' }} primary="View your public key" />
          </ListItem>
        </List>
      </Paper>

      <div style={{ display: 'flex', justifyContent: 'center', color: SECONDARY_GRAY }}>
        <Typography>Only connect to website you trust</Typography>
      </div>

      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Share
        </Button>
      </Container>
    </PageWithTitle>
  );
};
