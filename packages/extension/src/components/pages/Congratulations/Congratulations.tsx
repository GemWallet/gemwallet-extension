import { FC, useCallback } from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  HOME_PATH,
  PARAMETER_TRANSACTION_PAYMENT,
  TRANSACTION_PATH,
  TWITTER_LINK
} from '../../../constants';
import { openExternalLink } from '../../../utils';

export const Congratulations: FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleNext = useCallback(() => {
    if (search.includes(PARAMETER_TRANSACTION_PAYMENT)) {
      navigate(`${TRANSACTION_PATH}${search}`);
    } else {
      navigate(`${HOME_PATH}${search}`);
    }
  }, [navigate, search]);

  return (
    <Container
      component="main"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        padding: '48px 0 24px 0'
      }}
    >
      <Container
        style={{
          height: '100%',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" component="h1" style={{ marginTop: '140px' }}>
          Woo, you're in!
        </Typography>
        <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
          Follow along with product updates or reach out if you have any questions.
        </Typography>
        <Button
          variant="contained"
          startIcon={<TwitterIcon />}
          endIcon={<NavigateNextIcon />}
          style={{ width: '100%', marginTop: '25px' }}
          color="info"
          onClick={() => {
            openExternalLink(TWITTER_LINK);
          }}
        >
          Follow us on Twitter
        </Button>
      </Container>
      <Container style={{ display: 'flex', flexDirection: 'column', marginTop: '24px' }}>
        <Button variant="contained" onClick={handleNext}>
          Finish
        </Button>
      </Container>
    </Container>
  );
};
