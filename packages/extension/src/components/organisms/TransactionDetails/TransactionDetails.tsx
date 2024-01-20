import { FC, useEffect, useMemo, useState } from 'react';

import { Transaction } from '@gemwallet/constants';
import { Network, getNetwork, getNetworkByNetworkID } from '@gemwallet/constants';

import { useNetwork } from '../../../contexts';
import { useMainToken } from '../../../hooks';
import { DataCard, RawTransaction, TransactionDisplay } from '../../molecules';
import { Fee } from '../../organisms';
import { LoadingOverlay } from '../../templates';
import { WrongNetworkIDModal } from './WrongNetworkIDModal';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { chainName, networkName } = useNetwork();
  const mainToken = useMainToken();

  const currentNetwork = useMemo(() => {
    try {
      return getNetwork(chainName, networkName as Network);
    } catch (error) {
      return {
        ...getNetwork(chainName, 'Custom' as Network),
        customNetworkName: networkName as string
      };
    }
  }, [chainName, networkName]);

  const expectedNetwork = useMemo(() => {
    if (!txParam?.NetworkID) {
      return null;
    }

    return getNetworkByNetworkID(txParam?.NetworkID);
  }, [txParam?.NetworkID]);

  useEffect(() => {
    if (!expectedNetwork?.networkID) {
      return;
    }

    setShowModal(currentNetwork.networkID !== expectedNetwork?.networkID);
  }, [currentNetwork.networkID, expectedNetwork?.networkID]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

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
          <TransactionDisplay
            tx={txParam}
            useLegacy={false}
            displayTransactionType={displayTransactionType}
            hasMultipleAmounts={hasMultipleAmounts}
            mainToken={mainToken}
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
          alwaysExpand={true}
        />
      )}
      <WrongNetworkIDModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        expectedNetwork={expectedNetwork}
        currentNetwork={currentNetwork}
        setIsLoading={setIsLoading}
      />
    </>
  );
};
