import { CSSProperties, FC } from 'react';

import { Typography } from '@mui/material';
import ReactJson from 'react-json-view';

import { Hook } from '@gemwallet/constants';

interface HooksDisplayProps {
  hooks: Hook[];
  fontSize?: number;
}

export const HooksDisplay: FC<HooksDisplayProps> = ({ hooks, fontSize }) => {
  const style: CSSProperties = {
    fontSize: fontSize ? `${fontSize}px` : 'inherit'
  };

  if (!hooks.length) {
    return null;
  }

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
        {hooks.map((hook, key) => {
          return (
            <>
              <Typography>{hooks.length > 1 ? `Hook ${key} details` : 'Hook details'}</Typography>
              <ReactJson
                src={hook}
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
            </>
          );
        })}
      </div>
    </>
  );
};
