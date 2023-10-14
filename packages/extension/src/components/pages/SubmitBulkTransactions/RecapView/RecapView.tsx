import React, { useState } from 'react';

import { TransactionWithID } from '@gemwallet/constants';

import { KeyValueDisplay } from '../../../atoms';
import { DataCard } from '../../../molecules';
import { Fee } from '../../../organisms';
import { TransactionPage } from '../../../templates';

interface RecapProps {
  transactionsListParam: TransactionWithID[];
  estimatedFees: any;
  errorFees: any;
  hasEnoughFunds: boolean;
  handleReject: () => void;
  beginProcess: () => void;
}

export const RecapView: React.FC<RecapProps> = ({
  transactionsListParam,
  estimatedFees,
  errorFees,
  hasEnoughFunds,
  handleReject,
  beginProcess
}) => {
  const [isDataExpanded, setIsDataExpanded] = useState(false);
  const [isFeeExpanded, setIsFeeExpanded] = useState(false);

  const getTransactionCountsByType = () => {
    return transactionsListParam?.reduce<{ [key: string]: number }>((acc, transaction) => {
      const type = transaction.TransactionType;
      if (!acc[type]) {
        acc[type] = 1;
      } else {
        acc[type] += 1;
      }
      return acc;
    }, {});
  };

  return (
    <TransactionPage
      title="Bulk Transactions"
      description={[
        'You are about to submit multiple transactions at once.',
        'In the next step, you will be able to review each transaction individually.'
      ]}
      approveButtonText="Begin"
      hasEnoughFunds={hasEnoughFunds}
      actionButtonsDescription="Only submit transactions from third parties you trust."
      onClickApprove={beginProcess}
      onClickReject={handleReject}
    >
      <>
        <DataCard
          dataName="Recap"
          formattedData={
            <>
              <KeyValueDisplay
                keyName="Total number of transactions"
                value={transactionsListParam.length.toString()}
                useLegacy={false}
              />
              <KeyValueDisplay
                keyName="Types of transactions"
                value={Object.entries(getTransactionCountsByType() ?? {})
                  .map(([type, count]) => `${type}: ${count}`)
                  .join('\n')}
                useLegacy={false}
              />
            </>
          }
          isExpanded={isDataExpanded}
          setIsExpanded={setIsDataExpanded}
          paddingTop={10}
          thresholdHeight={150}
        />
        <DataCard
          formattedData={
            <Fee
              errorFees={errorFees}
              estimatedFees={estimatedFees}
              fee={null}
              isBulk={true}
              useLegacy={false}
            />
          }
          isExpanded={isFeeExpanded}
          setIsExpanded={setIsFeeExpanded}
          paddingTop={10}
        />
      </>
    </TransactionPage>
  );
};
