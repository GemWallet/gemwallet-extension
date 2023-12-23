import { FC, CSSProperties } from 'react';

import { Typography } from '@mui/material';
import ReactJson from 'react-json-view';

import { Transaction } from '@gemwallet/constants';

export interface RawTransactionProps {
  transaction: Transaction;
  fontSize?: number;
  collapsed?: boolean;
  title?: string;
}

export const RawTransaction: FC<RawTransactionProps> = ({
  transaction,
  fontSize,
  collapsed,
  title
}) => {
  const style: CSSProperties = {
    fontSize: fontSize ? `${fontSize}px` : 'inherit'
  };

  return (
    <>
      <style>{`
        .react-json-view .string-value {
          white-space: pre-wrap; /* allow text to break onto the next line */
          word-break: break-all; /* break long strings */
          font-size: ${fontSize ? `${fontSize}px` : 'inherit'};
        }
      `}</style>
      {title ? <Typography>{title}</Typography> : null}
      <div style={style}>
        <ReactJson
          src={transaction}
          theme="summerfruit"
          name={null}
          enableClipboard={false}
          collapsed={collapsed}
          shouldCollapse={false}
          onEdit={false}
          onAdd={false}
          onDelete={false}
          displayDataTypes={false}
          displayObjectSize={false}
          indentWidth={2}
        />
      </div>
    </>
  );
};
