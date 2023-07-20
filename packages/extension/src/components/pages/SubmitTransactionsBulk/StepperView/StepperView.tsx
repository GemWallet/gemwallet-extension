import React, { FC, useState } from 'react';

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
  transactionsToDisplay: TransactionWithID[];
  totalNumberOfTransactions: number;
  errorRequestRejection: string;
  handleBack: () => void;
  handleReject: () => void;
  handleNext: () => void;
  handleConfirm: () => void;
  handleReset: () => void;
}

const StepperView: FC<StepperViewProps> = ({
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

  const handleCollapseToggle = () => setCollapsed(!collapsed);

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
      <div style={{ marginBottom: '60px' }}>
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
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
            {transactionsToDisplay?.map((tx, index) => (
              <div key={index}>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                  {tx.txID} - {tx.transaction.TransactionType}
                </Typography>
                <ReactJson
                  src={tx.transaction}
                  theme="summerfruit"
                  name={null}
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
            ))}
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
                style={{ display: 'flex', justifyContent: 'space-evenly', margin: '10px' }}
              >
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleNextAndOpen}>
                  {activeStep === steps - 1 ? 'Submit' : 'Next'}
                </Button>
              </Container>
              <Container
                style={{ display: 'flex', justifyContent: 'space-evenly', margin: '10px' }}
              >
                <Button variant="contained" color="secondary" onClick={handleReject}>
                  Reject
                </Button>
                <div>
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
                        You are about to submit {totalNumberOfTransactions} transactions in bulk.
                        Are you sure?
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
                </div>
              </Container>
            </div>
          </div>
        )}
      </div>
    </PageWithTitle>
  );
};

export default StepperView;
