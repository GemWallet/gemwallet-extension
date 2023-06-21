import { FC } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { IconButton, Paper, Tooltip, Typography } from '@mui/material';

import { Memo, MintNFTFlags, PaymentFlags, TrustSetFlags } from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { formatAmount, formatFlags, formatToken } from '../../../utils';
import { TileLoader } from '../../atoms';

const DEFAULT_FEES = 'Loading ...';

type BaseTransactionProps = {
  fee: number | null;
  memos: Memo[] | null;
  flags: TrustSetFlags | PaymentFlags | MintNFTFlags | null;
  errorFees: string | null;
  estimatedFees: string;
};

export const BaseTransaction: FC<BaseTransactionProps> = ({
  fee,
  memos,
  flags,
  errorFees,
  estimatedFees
}) => (
  <>
    {memos && memos.length > 0 && (
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
    )}
    {flags && (
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Flags:</Typography>
        <Typography variant="body2">
          <pre style={{ margin: 0 }}>{formatFlags ? formatFlags(flags) : ''}</pre>
        </Typography>
      </Paper>
    )}
    <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
      <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="These are the fees to make the transaction over the network">
          <IconButton size="small">
            <ErrorIcon />
          </IconButton>
        </Tooltip>
        Network fees:
      </Typography>
      <Typography variant="body2" gutterBottom align="right">
        {errorFees ? (
          <Typography variant="caption" style={{ color: ERROR_RED }}>
            {errorFees}
          </Typography>
        ) : estimatedFees === DEFAULT_FEES ? (
          <TileLoader secondLineOnly />
        ) : fee ? (
          formatToken ? (
            formatToken(fee, 'XRP (manual)', true)
          ) : (
            ''
          )
        ) : formatAmount ? (
          formatAmount(estimatedFees)
        ) : (
          ''
        )}
      </Typography>
    </Paper>
  </>
);

export default BaseTransaction;
