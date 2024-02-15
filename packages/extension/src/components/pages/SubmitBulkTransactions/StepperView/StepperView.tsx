import { FC, useEffect, useMemo, useState } from 'react';

import { Typography } from '@mui/material';
import { NFTokenAcceptOffer, NFTokenBurn, NFTokenCancelOffer, NFTokenCreateOffer } from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';
import { NFTokenMint } from 'xrpl/dist/npm/models/transactions/NFTokenMint';

import { TransactionWithID } from '@gemwallet/constants';

import { useLedger, useNetwork } from '../../../../contexts';
import { resolveNFTData } from '../../../../utils/NFTDataResolver';
import { TxNFTData } from '../../../molecules';
import { TransactionPage } from '../../../templates';
import { ConfirmationDialog } from '../ConfirmationDialog';
import StepperPagination from './StepperNavigation';
import { TransactionsDisplay } from './TransactionsDisplay';

interface StepperViewProps {
  activeStep: number;
  steps: number;
  hasEnoughFunds: boolean;
  transactionsToDisplay: Record<number, TransactionWithID>;
  totalNumberOfTransactions: number;
  errorRequestRejection?: Error;
  handleBack: () => void;
  handleReject: () => void;
  handleNext: () => void;
  handleConfirm: () => void;
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
  handleConfirm
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [txNFTData, setTxNFTData] = useState<Record<number, TxNFTData>>({}); // Key is the transaction index
  const { networkName } = useNetwork();
  const { getNFTInfo, getLedgerEntry, getAccountInfo } = useLedger();

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
    const resolveNFTDataFromURI = async (URI: string, index: number, amount?: Amount) => {
      const NFTData = await resolveNFTData(
        {
          // Since we have an URI only, we provide a mock NFT object to the NFT resolver. It's fine because we just need
          // the data from the URI in this case
          Flags: 0,
          Issuer: '',
          NFTokenID: '',
          NFTokenTaxon: 0,
          nft_serial: 0,
          URI: URI
        },
        getAccountInfo
      );

      setTxNFTData((prev) => ({
        ...prev,
        [index]: {
          ...NFTData,
          ...(amount && { amount })
        }
      }));
    };
    const resolveNFTDataFromNFTokenID = async (
      NFTokenID: string,
      index: number,
      amount?: Amount
    ) => {
      try {
        const NFTInfo = await getNFTInfo(NFTokenID);
        const URI = NFTInfo.result.uri;

        resolveNFTDataFromURI(URI, index, amount);
      } catch (error) {}
    };
    const resolveNFTDataFromNFTOfferID = async (NFTOfferID: string, index: number) => {
      try {
        const ledgerEntry = await getLedgerEntry(NFTOfferID);
        const NFTokenID = (ledgerEntry?.result?.node as any)?.NFTokenID;
        if (!NFTokenID) return;

        const amount = (ledgerEntry?.result?.node as any)?.Amount;

        resolveNFTDataFromNFTokenID(NFTokenID, index, amount);
      } catch (error) {}
    };
    for (let key in transactionsToDisplay) {
      if (transactionsToDisplay.hasOwnProperty(key)) {
        if (transactionsToDisplay[key].TransactionType === 'NFTokenMint') {
          // We can only resolve using the URI. No NFT data since the NFT does not exist
          const URI = (transactionsToDisplay[key] as NFTokenMint).URI;
          if (!URI) continue;
          resolveNFTDataFromURI(URI, Number(key));
          continue;
        }

        if (
          ['NFTokenCreateOffer', 'NFTokenBurn'].includes(transactionsToDisplay[key].TransactionType)
        ) {
          // We directly have the NFTokenID, we can get the NFT data from these, then resolve the NFT as usual
          const NFTokenID = (transactionsToDisplay[key] as NFTokenCreateOffer | NFTokenBurn)
            .NFTokenID;
          resolveNFTDataFromNFTokenID(NFTokenID, Number(key));
          continue;
        }

        if (transactionsToDisplay[key].TransactionType === 'NFTokenAcceptOffer') {
          // We have an NFTOffer ID, we need to resolve the NFTOffer first, get the associated NFTokenID, then we can
          // resolve the NFT as usual
          const NFTOfferID =
            (transactionsToDisplay[key] as NFTokenAcceptOffer).NFTokenSellOffer ??
            (transactionsToDisplay[key] as NFTokenAcceptOffer).NFTokenBuyOffer;
          if (!NFTOfferID) continue;
          resolveNFTDataFromNFTOfferID(NFTOfferID, Number(key));
          continue;
        }

        if (transactionsToDisplay[key].TransactionType === 'NFTokenCancelOffer') {
          // Same as above, but we can have multiple NFTOffers
          const NFTOfferIDs = (transactionsToDisplay[key] as NFTokenCancelOffer).NFTokenOffers;
          NFTOfferIDs.forEach((NFTOfferID) => {
            resolveNFTDataFromNFTOfferID(NFTOfferID, Number(key));
          });
        }
      }
    }
  }, [getAccountInfo, getLedgerEntry, getNFTInfo, networkName, transactionsToDisplay]);

  const navigable = useMemo(() => {
    return steps > 1;
  }, [steps]);

  return (
    <TransactionPage
      title="Bulk Transactions"
      approveButtonText="Submit All"
      hasEnoughFunds={hasEnoughFunds}
      actionButtonsDescription="Please take a moment to review the transactions."
      onClickApprove={handleClickOpen}
      onClickReject={handleReject}
      navigation={{
        isNavigationEnabled: navigable,
        onNavigationPrevious: handleBack,
        onNavigationNext: handleNextAndOpen,
        isNavigationPreviousEnabled: activeStep > 0,
        isNavigationNextEnabled: activeStep < steps - 1
      }}
    >
      <StepperPagination navigable={navigable} steps={steps} activeStep={activeStep} />
      <div>
        <TransactionsDisplay transactionsToDisplay={transactionsToDisplay} txNFTData={txNFTData} />
        {errorRequestRejection ? (
          <Typography color="error">{errorRequestRejection.message}</Typography>
        ) : null}
        <ConfirmationDialog
          open={open}
          onClose={handleClose}
          onConfirm={handleConfirmAndClose}
          totalNumberOfTransactions={totalNumberOfTransactions}
        />
      </div>
    </TransactionPage>
  );
};
