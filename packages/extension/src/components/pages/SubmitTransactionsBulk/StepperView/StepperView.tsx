import React, { FC, useState } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Typography,
  Button,
  Container,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Pagination,
  PaginationItem
} from '@mui/material';
import ReactJson from 'react-json-view';

import { TransactionWithID } from '@gemwallet/constants';

import { ERROR_RED } from '../../../../constants';
import { PageWithTitle } from '../../../templates';

interface StepperViewProps {
  activeStep: number;
  steps: number;
  hasEnoughFunds: boolean;
  transactionsToDisplay: Record<number, TransactionWithID>;
  totalNumberOfTransactions: number;
  errorRequestRejection: string;
  handleBack: () => void;
  handleReject: () => void;
  handleNext: () => void;
  handleConfirm: () => void;
  handleReset: () => void;
}

export const StepperView: FC<StepperViewProps> = ({
  activeStep,
  steps,
  hasEnoughFunds,
  transactionsToDisplay,
  totalNumberOfTransactions,
  errorRequestRejection,
  handleBack,
  handleReject,
  handleNext,
  handleConfirm,
  handleReset
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [renderKey, setRenderKey] = useState<number>(0);

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
    setRenderKey((prevKey) => prevKey + 1); // Update key to re-render ReactJson
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmAndClose = () => {
    handleConfirm();
    handleClose();
  };

  const handleNextAndOpen = () => {
    if (activeStep === steps - 1) {
      handleClickOpen();
    } else {
      handleNext();
    }
  };

  return (
    <PageWithTitle title="Bulk Transactions" styles={{ container: { justifyContent: 'initial' } }}>
      <div style={{ marginBottom: '100px' }}>
        {steps > 1 ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Pagination
              count={steps}
              page={activeStep + 1}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent',
                      cursor: 'default'
                    }
                  }}
                />
              )}
              variant="outlined"
              color="primary"
              hidePrevButton
              hideNextButton
            />
          </div>
        ) : null}
        {!hasEnoughFunds ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ErrorIcon style={{ color: ERROR_RED }} />
            <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
              Insufficient funds.
            </Typography>
          </div>
        ) : null}
        {activeStep === steps ? (
          <div>
            <Typography>All steps completed</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Button
              variant="outlined"
              onClick={handleCollapseToggle}
              style={{
                marginTop: '20px',
                marginBottom: '20px',
                padding: '6px 12px',
                fontSize: '0.875em'
              }}
            >
              {collapsed ? 'Expand All' : 'Collapse All'}
            </Button>
            {Object.entries(transactionsToDisplay || {}).map(([key, tx]) => {
              const { ID, ...txWithoutID } = tx;
              return (
                <div key={key}>
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                    {Number(key) + 1} - {tx.TransactionType}
                  </Typography>
                  <ReactJson
                    src={txWithoutID}
                    theme="summerfruit"
                    name={null}
                    key={renderKey}
                    enableClipboard={false}
                    collapsed={collapsed}
                    shouldCollapse={false}
                    onEdit={false}
                    onAdd={false}
                    onDelete={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    indentWidth={2}
                  />
                </div>
              );
            })}

            {errorRequestRejection && (
              <Typography color="error">{errorRequestRejection}</Typography>
            )}
            <div
              style={{
                justifyContent: 'center',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#1d1d1d'
              }}
            >
              <Container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '10px'
                }}
              >
                <Button variant="contained" color="secondary" onClick={handleReject}>
                  Reject
                </Button>
                {steps > 1 ? (
                  <>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      startIcon={<ArrowBackIcon />}
                    />
                    <Button
                      disabled={activeStep === steps - 1}
                      onClick={handleNextAndOpen}
                      endIcon={<ArrowForwardIcon />}
                    />
                  </>
                ) : null}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClickOpen}
                  disabled={!hasEnoughFunds}
                >
                  Submit all
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{'Submit all transactions'}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      You are about to submit {totalNumberOfTransactions} transactions in bulk. Are
                      you sure?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmAndClose} color="primary" autoFocus>
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
              </Container>
            </div>
          </div>
        )}
      </div>
    </PageWithTitle>
  );
};
