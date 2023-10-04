import React, { FC } from 'react';

import { Paper, Typography } from '@mui/material';
import ReactJson from 'react-json-view';
import { Transaction } from 'xrpl';

interface RawTransactionProps {
  transaction: Transaction;
}

export const RawTransaction: FC<RawTransactionProps> = ({ transaction }) => {
  return (
    <>
      <style>{`
        .react-json-view .string-value {
          white-space: pre-wrap; /* allow text to break onto the next line */
          word-break: break-all; /* break long strings */
        }
      `}</style>

      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Raw Transaction:</Typography>
        <ReactJson
          src={transaction}
          theme="summerfruit"
          name={null}
          enableClipboard={false}
          collapsed={false}
          shouldCollapse={false}
          onEdit={false}
          onAdd={false}
          onDelete={false}
          displayDataTypes={false}
          displayObjectSize={false}
          indentWidth={2}
        />
      </Paper>
    </>
  );
};
