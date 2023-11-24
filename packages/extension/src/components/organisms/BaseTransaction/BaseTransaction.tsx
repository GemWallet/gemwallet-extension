import { FC, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { IconButton, Paper, Tooltip, Typography } from '@mui/material';
import MuiInput from '@mui/material/Input';
import { dropsToXrp, xrpToDrops } from 'xrpl';

import {
  CreateNFTOfferFlags,
  CreateOfferFlags,
  Memo,
  MintNFTFlags,
  PaymentFlags,
  SetAccountFlags,
  TrustSetFlags,
  getMaxFeeInDrops
} from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { useNetwork } from '../../../contexts';
import { formatAmount, formatFlags, formatToken } from '../../../utils';
import { TileLoader } from '../../atoms';

const DEFAULT_FEES = 'Loading ...';

type BaseTransactionProps = {
  fee: number | null;
  memos: Memo[] | null;
  flags:
    | TrustSetFlags
    | PaymentFlags
    | MintNFTFlags
    | CreateNFTOfferFlags
    | CreateOfferFlags
    | SetAccountFlags
    | null;
  errorFees: string | undefined;
  estimatedFees: string;
};

type FeeProps = {
  fee: number | null;
  errorFees: string | undefined;
  estimatedFees: string;
  isBulk?: boolean;
  onFeeChange?: (newFee: number) => void;
  useLegacy?: boolean;
};

export const BaseTransaction: FC<BaseTransactionProps> = ({
  fee,
  memos,
  flags,
  errorFees,
  estimatedFees
}) => (
  <>
    {memos && memos.length > 0 ? (
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Memos:</Typography>
        {memos.map((memo, index) => (
          <div key={index} style={{ marginBottom: index === memos.length - 1 ? 0 : '8px' }}>
            <Typography
              variant="body2"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              {memo.memo.memoData}
            </Typography>
          </div>
        ))}
      </Paper>
    ) : null}
    {flags ? (
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Flags:</Typography>
        <Typography variant="body2">
          <pre style={{ margin: 0 }}>{formatFlags(flags)}</pre>
        </Typography>
      </Paper>
    ) : null}
    <Fee errorFees={errorFees} estimatedFees={estimatedFees} fee={fee} />
  </>
);

export const Fee: FC<FeeProps> = ({
  errorFees,
  estimatedFees,
  fee,
  isBulk,
  onFeeChange,
  useLegacy = true
}) => {
  const { chainName } = useNetwork();
  const [isEditing, setIsEditing] = useState(false);

  const handleFeeClick = () => {
    if (onFeeChange !== undefined) {
      setIsEditing(true);
    }
  };

  const handleFeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFee = Number(event.target.value);
    if (onFeeChange) {
      onFeeChange(Number(xrpToDrops(newFee)));
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  if (useLegacy) {
    return (
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip
            title={
              isBulk
                ? 'These are the total fees to submit all the transactions over the network'
                : 'These are the fees to submit the transaction over the network'
            }
          >
            <IconButton size="small">
              <ErrorIcon />
            </IconButton>
          </Tooltip>
          {isBulk ? 'Total network fees' : 'Network fees'}:
        </Typography>
        <Typography variant="body2" gutterBottom align="right">
          {errorFees ? (
            <Typography variant="caption" style={{ color: ERROR_RED }}>
              {errorFees}
            </Typography>
          ) : estimatedFees === DEFAULT_FEES ? (
            <TileLoader secondLineOnly />
          ) : fee ? (
            formatToken(fee, 'XRP (manual)', true)
          ) : (
            formatAmount(estimatedFees)
          )}
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Typography variant="body1" style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
        <Tooltip
          title={
            isBulk
              ? 'These are the total fees to submit all the transactions over the network'
              : 'These are the fees to submit the transaction over the network'
          }
        >
          <IconButton size="small">
            <ErrorIcon />
          </IconButton>
        </Tooltip>
        {isBulk ? 'Total network fees' : 'Network fees'}
      </Typography>
      <Typography variant="body2" gutterBottom align="right">
        {isEditing ? (
          <MuiInput
            value={fee !== null ? dropsToXrp(fee) : dropsToXrp(estimatedFees)}
            onChange={handleFeeChange}
            onBlur={handleBlur}
            autoFocus
            size="small"
            inputProps={{
              step: dropsToXrp(1),
              min: dropsToXrp(1),
              max: dropsToXrp(getMaxFeeInDrops(chainName)),
              type: 'number'
            }}
          />
        ) : errorFees ? (
          <Typography
            variant="caption"
            style={{ color: ERROR_RED, cursor: 'pointer' }}
            onClick={handleFeeClick}
          >
            {errorFees}
          </Typography>
        ) : estimatedFees === DEFAULT_FEES ? (
          <TileLoader secondLineOnly />
        ) : fee !== null ? (
          <span onClick={handleFeeClick} style={{ cursor: 'pointer' }}>
            {formatToken(fee, 'XRP (manual)', true)}
          </span>
        ) : (
          <span onClick={handleFeeClick} style={{ cursor: 'pointer' }}>
            {formatAmount(estimatedFees)}
          </span>
        )}
      </Typography>
    </>
  );
};

export default BaseTransaction;
