import { FC } from 'react';

import { TransactionDetails } from '../../../organisms';
import { TransactionPage } from '../../../templates';
import { Params } from '../AddNewTrustline';

interface StepConfirmProps {
  params: Params;
  estimatedFees: string;
  errorFees: string | undefined;
  hasEnoughFunds: boolean;
  onReject: () => void;
  onConfirm: () => void;
}

export const StepConfirm: FC<StepConfirmProps> = ({
  params,
  estimatedFees,
  errorFees,
  hasEnoughFunds,
  onReject,
  onConfirm
}) => {
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
        errorFees={errorFees}
        displayTransactionType={false}
      />
    </TransactionPage>
  );
};
