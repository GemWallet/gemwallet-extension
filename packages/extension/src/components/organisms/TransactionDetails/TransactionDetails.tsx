import React, { FC, useState } from 'react';

import { Transaction } from 'xrpl';

import { DataCard, RawTransaction, XRPLTransaction } from '../../molecules';
import { Fee } from '../../organisms';
import { LoadingOverlay } from '../../templates';

interface TransactionDetailsProps {
  txParam: Transaction | null;
  estimatedFees: string;
  errorFees?: string;
}

export const TransactionDetails: FC<TransactionDetailsProps> = ({
  txParam,
  errorFees,
  estimatedFees
}) => {
  const [isTxExpanded, setIsTxExpanded] = useState(false);
  const [isRawTxExpanded, setIsRawTxExpanded] = useState(false);
  const [isFeeExpanded, setIsFeeExpanded] = useState(false);

  if (!txParam?.Account) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <DataCard
        formattedData={<XRPLTransaction tx={txParam} useLegacy={false} />}
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
    </>
  );
};

export default TransactionDetails;
