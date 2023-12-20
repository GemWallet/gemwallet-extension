import { FC, useCallback, useState } from 'react';

import { TransactionDetails } from '../../../organisms';
import { TransactionPage } from '../../../templates';
import { Params } from '../AddNewTrustline';

interface StepConfirmProps {
  inputParams: Params;
  estimatedFees: string;
  minimumFees: string;
  errorFees: string | undefined;
  hasEnoughFunds: boolean;
  onReject: () => void;
  onConfirm: () => void;
}

export const StepConfirm: FC<StepConfirmProps> = ({
  inputParams,
  estimatedFees,
  minimumFees,
  errorFees,
  hasEnoughFunds,
  onReject,
  onConfirm
}) => {
  const [params, setParams] = useState<Params>(inputParams);

  const handleFeeChange = useCallback(
    (fee: number) => {
      if (params.transaction) {
        setParams({
          ...params,
          transaction: {
            ...params.transaction,
            Fee: fee.toString()
          }
        });
      }
    },
    [params]
  );

  return (
    <TransactionPage
      title="Set Trustline"
      description="Please review the transaction below."
      approveButtonText="Submit"
      onClickApprove={onConfirm}
      onClickReject={onReject}
      hasEnoughFunds={hasEnoughFunds}
    >
      <TransactionDetails
        txParam={params.transaction}
        estimatedFees={estimatedFees}
        minimumFees={minimumFees}
        errorFees={errorFees}
        displayTransactionType={false}
        onFeeChange={handleFeeChange}
      />
    </TransactionPage>
  );
};
