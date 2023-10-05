import { FC } from 'react';

import { Button, Container, Grid, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';

const BUTTONS_WIDTH = '150px';

export interface ActionButtonsProps {
  onClickApprove: () => void;
  onClickReject: () => void;
  headerText?: string;
  isApproveEnabled?: boolean;
  approveButtonText?: string;
}

export const ActionButtons: FC<ActionButtonsProps> = ({
  onClickApprove,
  onClickReject,
  headerText,
  isApproveEnabled = true,
  approveButtonText = 'Sign'
}) => {
  const buttonStyle = {
    minWidth: BUTTONS_WIDTH,
    height: headerText ? undefined : '42px'
  };

  return (
    <div
      style={{
        backgroundColor: '#272727',
        position: 'fixed',
        width: '100%',
        bottom: 0,
        paddingTop: '10px',
        paddingBottom: '10px',
        boxShadow: '0 -2px 15px rgba(0, 0, 0, 0.35)'
      }}
    >
      {headerText ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            color: SECONDARY_GRAY,
            paddingBottom: '10px'
          }}
        >
          <Typography variant="body2" align="center">
            {headerText}
          </Typography>
        </div>
      ) : null}
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={onClickReject}
              style={buttonStyle}
            >
              Reject
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={onClickApprove}
              style={buttonStyle}
              disabled={!isApproveEnabled}
            >
              {approveButtonText}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
