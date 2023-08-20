import React, { CSSProperties, FC, useState } from 'react';

import ReactJson from 'react-json-view';

import { Hook } from '@gemwallet/constants';

import { DataCard } from '../../molecules';

interface HooksDisplayProps {
  hooks: Hook[];
  fontSize?: number;
}

export const HooksDisplay: FC<HooksDisplayProps> = ({ hooks, fontSize }) => {
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});

  const handleToggleExpand = (key: string) => {
    setExpandedStates((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
            <DataCard
              formattedData={
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
              }
              dataName={hooks.length > 1 ? `Hook ${key} details` : 'Hook details'}
              isExpanded={expandedStates[key]}
              setIsExpanded={() => handleToggleExpand(key.toString())}
              paddingTop={key > 0 ? 10 : undefined}
              thresholdHeight={300}
            />
          );
        })}
      </div>
    </>
  );
};
