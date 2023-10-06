import React, { FC, CSSProperties } from 'react';

import ReactJson from 'react-json-view';
import { Transaction } from 'xrpl';

export interface RawTransactionProps {
  transaction: Transaction;
  fontSize?: number;
}

export const RawTransaction: FC<RawTransactionProps> = ({ transaction, fontSize }) => {
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
      <div style={style}>
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
      </div>
    </>
  );
};
