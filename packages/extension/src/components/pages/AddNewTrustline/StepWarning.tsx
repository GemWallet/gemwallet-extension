import { FC } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Button, Container, Typography } from '@mui/material';

import { PageWithTitle } from '../../templates';

interface StepWarningProps {
  onReject: () => void;
  onContinue: () => void;
}

export const StepWarning: FC<StepWarningProps> = ({ onReject, onContinue }) => {
  return (
    <PageWithTitle title="Add Trustline">
      <div
        style={{
          height: '100%',
          paddingTop: '50px'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <WarningIcon color="warning" fontSize="large" />
          <Typography color="#ffac33">Warning</Typography>
        </div>
        <Typography align="center" style={{ marginTop: '2rem' }}>
          GemWallet does not recommend or support any particular token or issuer.
        </Typography>
        <Typography align="center" variant="body2" style={{ marginTop: '1rem' }}>
          It is important to add only the tokens and issuers you trust.
        </Typography>
        <Typography align="center" variant="body2" style={{ marginTop: '1rem' }}>
          Continue at your own risk
        </Typography>
      </div>
      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={onReject}>
          Reject
        </Button>
        <Button variant="contained" onClick={onContinue} disabled={false}>
          Continue
        </Button>
      </Container>
    </PageWithTitle>
  );
};
