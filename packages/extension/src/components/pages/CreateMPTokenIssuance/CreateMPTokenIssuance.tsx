import { FC, useCallback, useState } from 'react';

import TokenIcon from '@mui/icons-material/Token';
import {
  Avatar,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { HOME_PATH, SECONDARY_GRAY } from '../../../constants';
import {
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { useFees } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { toUIError } from '../../../utils/errors';
import { InformationMessage } from '../../molecules';
import { Fee } from '../../organisms';
import { AsyncTransaction, PageWithReturn } from '../../templates';

const DEFAULT_FEES = '12';

// MPTokenIssuanceCreate flags
const FLAG_CAN_LOCK = 0x0002; // tfMPTCanLock - Issuer can lock tokens
const FLAG_REQUIRE_AUTH = 0x0004; // tfMPTRequireAuth - Requires issuer authorization to hold
const FLAG_CAN_ESCROW = 0x0008; // tfMPTCanEscrow - Can be used in escrow
const FLAG_CAN_TRADE = 0x0010; // tfMPTCanTrade - Can be traded in DEX
const FLAG_CAN_TRANSFER = 0x0020; // tfMPTCanTransfer - Holders can transfer between themselves
const FLAG_CAN_CLAWBACK = 0x0040; // tfMPTCanClawback - Issuer can clawback tokens

export const CreateMPTokenIssuance: FC = () => {
  // Form fields
  const [assetScale, setAssetScale] = useState<string>('');
  const [maximumAmount, setMaximumAmount] = useState<string>('');
  const [transferFee, setTransferFee] = useState<string>('');
  const [metadata, setMetadata] = useState<string>('');

  // Flags
  const [canLock, setCanLock] = useState(false);
  const [requireAuth, setRequireAuth] = useState(false);
  const [canEscrow, setCanEscrow] = useState(false);
  const [canTrade, setCanTrade] = useState(true);
  const [canTransfer, setCanTransfer] = useState(true);
  const [canClawback, setCanClawback] = useState(false);

  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error | null>(null);

  const navigate = useNavigate();
  const { createMPTokenIssuance } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();

  const { estimatedFees, errorFees } = useFees(
    [
      {
        TransactionType: 'AccountSet',
        Account: ''
      }
    ],
    DEFAULT_FEES
  );

  const calculateFlags = useCallback(() => {
    let flags = 0;
    if (canLock) flags |= FLAG_CAN_LOCK;
    if (requireAuth) flags |= FLAG_REQUIRE_AUTH;
    if (canEscrow) flags |= FLAG_CAN_ESCROW;
    if (canTrade) flags |= FLAG_CAN_TRADE;
    if (canTransfer) flags |= FLAG_CAN_TRANSFER;
    if (canClawback) flags |= FLAG_CAN_CLAWBACK;
    return flags;
  }, [canLock, requireAuth, canEscrow, canTrade, canTransfer, canClawback]);

  const handleCreate = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    setTransactionProgress(TransactionProgressStatus.IN_PROGRESS);

    const params: {
      assetScale?: number;
      maximumAmount?: string;
      transferFee?: number;
      metadata?: string;
      flags?: number;
    } = {};

    if (assetScale) {
      params.assetScale = parseInt(assetScale, 10);
    }
    if (maximumAmount) {
      params.maximumAmount = maximumAmount;
    }
    if (transferFee) {
      // Transfer fee is in tenths of a basis point (0.001%)
      // UI shows percentage, convert to internal format
      params.transferFee = Math.round(parseFloat(transferFee) * 1000);
    }
    if (metadata) {
      // Convert metadata JSON to hex
      params.metadata = Buffer.from(metadata, 'utf8').toString('hex').toUpperCase();
    }

    const flags = calculateFlags();
    if (flags > 0) {
      params.flags = flags;
    }

    createMPTokenIssuance(params)
      .then(() => {
        setTransaction(TransactionStatus.Success);
      })
      .catch((e) => {
        setErrorRequestRejection(e);
        setTransaction(TransactionStatus.Rejected);
      })
      .finally(() => {
        setTransactionProgress(TransactionProgressStatus.IDLE);
      });
  }, [
    assetScale,
    maximumAmount,
    transferFee,
    metadata,
    calculateFlags,
    createMPTokenIssuance,
    setTransactionProgress
  ]);

  const handleReject = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

  if (transaction === TransactionStatus.Success || transaction === TransactionStatus.Rejected) {
    return (
      <AsyncTransaction
        title={
          transaction === TransactionStatus.Success
            ? 'MPToken issuance created'
            : 'MPToken issuance failed'
        }
        subtitle={
          transaction === TransactionStatus.Success
            ? `You have successfully created an MPToken issuance on the ${networkName}`
            : undefined
        }
        transaction={transaction}
        {...(errorRequestRejection && {
          errorMessage: toUIError(errorRequestRejection).message
        })}
      />
    );
  }

  // Validate transfer fee (0-50%)
  const isValidTransferFee =
    !transferFee || (parseFloat(transferFee) >= 0 && parseFloat(transferFee) <= 50);

  // Validate asset scale (0-9)
  const isValidAssetScale =
    !assetScale || (parseInt(assetScale, 10) >= 0 && parseInt(assetScale, 10) <= 9);

  return (
    <PageWithReturn title="Create MPToken Issuance" onBackClick={handleReject}>
      <Container
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '80px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <TokenIcon />
          </Avatar>
          <div>
            <Typography variant="h6">Create MPToken Issuance</Typography>
            <Typography variant="caption" style={{ color: SECONDARY_GRAY }}>
              Issue your own Multi-Purpose Token
            </Typography>
          </div>
        </div>

        <InformationMessage title="Information">
          <Typography variant="body2">
            Creating an MPToken issuance allows you to issue your own tokens on the XRP Ledger. You
            will be the issuer and can control token properties.
          </Typography>
        </InformationMessage>

        <TextField
          label="Asset Scale (Decimal Places)"
          placeholder="0-9 (e.g., 2 for cents)"
          value={assetScale}
          onChange={(e) => setAssetScale(e.target.value)}
          fullWidth
          type="number"
          inputProps={{ min: 0, max: 9 }}
          helperText={!isValidAssetScale ? 'Must be between 0 and 9' : 'Number of decimal places'}
          error={!isValidAssetScale}
        />

        <TextField
          label="Maximum Amount (Optional)"
          placeholder="Maximum supply (leave empty for unlimited)"
          value={maximumAmount}
          onChange={(e) => setMaximumAmount(e.target.value)}
          fullWidth
        />

        <TextField
          label="Transfer Fee % (Optional)"
          placeholder="0-50% fee for transfers"
          value={transferFee}
          onChange={(e) => setTransferFee(e.target.value)}
          fullWidth
          type="number"
          inputProps={{ min: 0, max: 50, step: 0.001 }}
          helperText={
            !isValidTransferFee ? 'Must be between 0% and 50%' : 'Fee charged on token transfers'
          }
          error={!isValidTransferFee}
        />

        <TextField
          label="Metadata (Optional JSON)"
          placeholder='{"ticker": "TKN", "name": "My Token"}'
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          fullWidth
          multiline
          rows={3}
          helperText="XLS-89 metadata (ticker, name, desc, icon, etc.)"
        />

        <Typography variant="subtitle2" style={{ marginTop: '10px', color: SECONDARY_GRAY }}>
          Token Capabilities
        </Typography>

        <FormControlLabel
          control={
            <Checkbox checked={canTransfer} onChange={(e) => setCanTransfer(e.target.checked)} />
          }
          label="Can Transfer (holders can send to each other)"
        />
        <FormControlLabel
          control={<Checkbox checked={canTrade} onChange={(e) => setCanTrade(e.target.checked)} />}
          label="Can Trade (tradeable on DEX)"
        />
        <FormControlLabel
          control={
            <Checkbox checked={canEscrow} onChange={(e) => setCanEscrow(e.target.checked)} />
          }
          label="Can Escrow"
        />
        <FormControlLabel
          control={<Checkbox checked={canLock} onChange={(e) => setCanLock(e.target.checked)} />}
          label="Can Lock (issuer can lock holder tokens)"
        />
        <FormControlLabel
          control={
            <Checkbox checked={canClawback} onChange={(e) => setCanClawback(e.target.checked)} />
          }
          label="Can Clawback (issuer can reclaim tokens)"
        />
        <FormControlLabel
          control={
            <Checkbox checked={requireAuth} onChange={(e) => setRequireAuth(e.target.checked)} />
          }
          label="Require Authorization (holders need approval)"
        />

        <Fee
          errorFees={errorFees}
          estimatedFees={estimatedFees}
          fee={estimatedFees ? Number(estimatedFees) : null}
          useLegacy
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <Button variant="outlined" onClick={handleReject} fullWidth>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={
              !isValidTransferFee || !isValidAssetScale || transaction === TransactionStatus.Pending
            }
            fullWidth
          >
            {transaction === TransactionStatus.Pending ? 'Creating...' : 'Create Issuance'}
          </Button>
        </div>
      </Container>
    </PageWithReturn>
  );
};
