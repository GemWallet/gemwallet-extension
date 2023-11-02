import React, { FC, useState } from 'react';

import { Transaction } from 'xrpl';

import { DataCard, RawTransaction, XRPLTransaction } from '../../molecules';
import { Fee } from '../../organisms';
import { LoadingOverlay } from '../../templates';

interface TransactionDetailsProps {
  txParam: Transaction | null;
  estimatedFees: string;
  errorFees?: string;
  isConnectionFailed?: boolean;
  displayTransactionType?: boolean;
}

export const TransactionDetails: FC<TransactionDetailsProps> = ({
  txParam,
  errorFees,
  estimatedFees,
  isConnectionFailed,
  displayTransactionType
}) => {
  const [isTxExpanded, setIsTxExpanded] = useState(false);
  const [isRawTxExpanded, setIsRawTxExpanded] = useState(false);
  const [isFeeExpanded, setIsFeeExpanded] = useState(false);

  if (!txParam?.Account) {
    return <LoadingOverlay />;
  }

  const hasMultipleAmounts =
    ('Amount' in txParam && 'Amount2' in txParam) ||
    ('DeliverMin' in txParam && 'SendMax' in txParam);

  return (
    <>
      <DataCard
        formattedData={
          <XRPLTransaction
            tx={txParam}
            useLegacy={false}
            displayTransactionType={displayTransactionType}
            hasMultipleAmounts={hasMultipleAmounts}
          />
        }
        dataName="Transaction details"
        isExpanded={isTxExpanded}
        setIsExpanded={setIsTxExpanded}
        paddingTop={10}
      />
      <DataCard
        formattedData={<RawTransaction transaction={txParam} fontSize={12} />}
        dataName="Raw transaction"
        isExpanded={isRawTxExpanded}
        setIsExpanded={setIsRawTxExpanded}
        thresholdHeight={50}
        paddingTop={10}
      />
      {isConnectionFailed ? null : (
        <DataCard
          formattedData={
            <Fee
              errorFees={errorFees}
              estimatedFees={estimatedFees}
              fee={txParam?.Fee ? Number(txParam?.Fee) : null}
              useLegacy={false}
            />
          }
          isExpanded={isFeeExpanded}
          setIsExpanded={setIsFeeExpanded}
          paddingTop={10}
        />
      )}
    </>
  );
};
