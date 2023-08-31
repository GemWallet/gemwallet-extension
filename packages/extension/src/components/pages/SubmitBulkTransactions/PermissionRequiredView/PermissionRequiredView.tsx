import React, { FC } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Button, Container, Typography } from '@mui/material';

import { PageWithTitle } from '../../../templates';

interface PermissionRequiredViewProps {
  handleReject: () => void;
  enableBulkTransactionPermission: () => void;
}

export const PermissionRequiredView: FC<PermissionRequiredViewProps> = ({
  handleReject,
  enableBulkTransactionPermission
}) => {
  return (
    <PageWithTitle
      title="Permission required"
      styles={{ container: { justifyContent: 'initial' } }}
    >
      <div style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <WarningIcon color="warning" fontSize="large" />
          <Typography color="#ffac33">Warning</Typography>
        </div>
        <div style={{ marginTop: '15px', marginBottom: '15px' }}>
          <Typography variant="body1" color="textPrimary" style={{ marginTop: '5px' }}>
            Bulk Transactions Submission
          </Typography>
        </div>
        <div style={{ marginTop: '5px', marginBottom: '15px' }}>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
            The bulk transactions submission permission is currently disabled. You need to enable it
            in order to continue.
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
            Enabling this permission will allow the system to submit multiple transactions in bulk.
            This is a powerful feature and should be used responsibly.
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '40px' }}>
            You can enable or disable this permission at any time, in the settings page.
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1d1d1d'
          }}
        >
          <Container style={{ display: 'flex', justifyContent: 'space-evenly', margin: '10px' }}>
            <Button variant="contained" color="secondary" onClick={handleReject}>
              Reject
            </Button>
            <Button onClick={enableBulkTransactionPermission} variant="contained" color="primary">
              Enable Permission
            </Button>
          </Container>
        </div>
      </div>
    </PageWithTitle>
  );
};
