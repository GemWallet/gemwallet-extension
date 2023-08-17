import React, { FC, useEffect, useState } from 'react';

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
  PaginationItem,
  CardMedia,
  Card
} from '@mui/material';
import ReactJson from 'react-json-view';
import { NFTokenAcceptOffer, NFTokenBurn, NFTokenCancelOffer, NFTokenCreateOffer } from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';
import { NFTokenMint } from 'xrpl/dist/npm/models/transactions/NFTokenMint';

import { NFTData, TransactionWithID } from '@gemwallet/constants';

import { ERROR_RED } from '../../../../constants';
import { useLedger, useNetwork } from '../../../../contexts';
import { formatAmount } from '../../../../utils';
import { resolveNFTData } from '../../../../utils/NFTDataResolver';
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

type TxNFTData = NFTData & {
  amount?: Amount; // For NFT offers
};

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
  const [txNFTData, setTxNFTData] = useState<Record<number, TxNFTData>>({}); // Key is the transaction index
  const { networkName } = useNetwork();
  const { getNFTInfo, getLedgerEntry } = useLedger();

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

  useEffect(() => {
    const resolveImageFromURI = async (URI: string, index: number, amount?: Amount) => {
      const NFTData = await resolveNFTData({ URI: URI });

      setTxNFTData((prev) => ({
        ...prev,
        [index]: {
          ...NFTData,
          ...(amount && { amount })
        }
      }));
    };
    const resolveImageFromNFTokenID = async (NFTokenID: string, index: number, amount?: Amount) => {
      try {
        const NFTInfo = await getNFTInfo(NFTokenID, networkName);
        const URI = NFTInfo.result.uri;

        resolveImageFromURI(URI, index, amount);
      } catch (error) {}
    };
    const resolveImageFromNFTOfferID = async (NFTOfferID: string, index: number) => {
      try {
        const ledgerEntry = await getLedgerEntry(NFTOfferID);
        const NFTokenID = (ledgerEntry?.result?.node as any)?.NFTokenID;
        if (!NFTokenID) return;

        const amount = (ledgerEntry?.result?.node as any)?.Amount;

        resolveImageFromNFTokenID(NFTokenID, index, amount);
      } catch (error) {}
    };
    for (let key in transactionsToDisplay) {
      if (transactionsToDisplay.hasOwnProperty(key)) {
        if (transactionsToDisplay[key].TransactionType === 'NFTokenMint') {
          const URI = (transactionsToDisplay[key] as NFTokenMint).URI;
          if (!URI) continue;
          resolveImageFromURI(URI, Number(key));
          continue;
        }

        if (
          ['NFTokenCreateOffer', 'NFTokenBurn'].includes(transactionsToDisplay[key].TransactionType)
        ) {
          const NFTokenID = (transactionsToDisplay[key] as NFTokenCreateOffer | NFTokenBurn)
            .NFTokenID;
          resolveImageFromNFTokenID(NFTokenID, Number(key));
          continue;
        }

        if (transactionsToDisplay[key].TransactionType === 'NFTokenAcceptOffer') {
          const NFTOfferID =
            (transactionsToDisplay[key] as NFTokenAcceptOffer).NFTokenSellOffer ||
            (transactionsToDisplay[key] as NFTokenAcceptOffer).NFTokenBuyOffer;
          if (!NFTOfferID) continue;
          resolveImageFromNFTOfferID(NFTOfferID, Number(key));
          continue;
        }

        if (transactionsToDisplay[key].TransactionType === 'NFTokenCancelOffer') {
          const NFTOfferIDs = (transactionsToDisplay[key] as NFTokenCancelOffer).NFTokenOffers;
          NFTOfferIDs.map((NFTOfferID) => resolveImageFromNFTOfferID(NFTOfferID, Number(key)));
        }
      }
    }
  }, [getLedgerEntry, getNFTInfo, networkName, transactionsToDisplay]);

  return (
    <PageWithTitle title="Bulk Transactions" styles={{ container: { justifyContent: 'initial' } }}>
      <div style={{ marginBottom: '40px' }}>
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
                <div key={key} style={{ marginBottom: '20px' }}>
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    style={{ marginTop: '5px', fontSize: '1.2em' }}
                  >
                    {Number(key) + 1} - {tx.TransactionType}
                  </Typography>
                  {'Amount' in txWithoutID && txWithoutID.Amount ? (
                    <Typography variant="body2" color="textSecondary">
                      {formatAmount(txWithoutID.Amount)}
                    </Typography>
                  ) : null}
                  {txNFTData[Number(key)] && txNFTData[Number(key)].amount ? (
                    <Typography variant="body2" color="textSecondary">
                      {formatAmount(txNFTData[Number(key)].amount as Amount)}
                    </Typography>
                  ) : null}
                  {txNFTData[Number(key)] && txNFTData[Number(key)].name ? (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{
                        marginTop: '5px',
                        fontWeight: 'lighter',
                        fontStyle: 'italic',
                        fontSize: '1em'
                      }}
                    >
                      {txNFTData[Number(key)].name}
                    </Typography>
                  ) : null}
                  {txNFTData[Number(key)] && txNFTData[Number(key)].image ? (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                      <Card sx={{ maxWidth: 300 }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={txNFTData[Number(key)].image}
                          alt="NFT Image"
                        />
                      </Card>
                    </div>
                  ) : null}
                  <div style={{ marginTop: '5px' }}>
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
