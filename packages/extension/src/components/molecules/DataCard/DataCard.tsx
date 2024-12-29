import { FC, useEffect, useRef, useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Paper, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';

export interface DataCardProps {
  formattedData: string;
  dataName?: string;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  thresholdHeight?: number;
  paddingTop?: number;
  alwaysExpand?: boolean;
}

export const DataCard: FC<DataCardProps> = ({
  formattedData,
  dataName,
  isExpanded,
  setIsExpanded,
  thresholdHeight = 120,
  paddingTop = 30,
  alwaysExpand = false
}) => {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const [isExpandable, setIsExpandable] = useState(false);

  useEffect(() => {
    if (alwaysExpand) {
      setIsExpandable(false);
    } else if (messageBoxRef.current && messageBoxRef.current.offsetHeight > thresholdHeight) {
      setIsExpandable(true);
    } else {
      setIsExpandable(false);
    }
  }, [formattedData, thresholdHeight, alwaysExpand]);

  return (
    <Paper
      elevation={24}
      style={{
        padding: '15px',
        marginTop: `${paddingTop}px`,
        borderRadius: '8px',
        backgroundColor: '#000000'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: isExpandable ? '-12px' : '0'
        }}
      >
        {isExpandable ? (
          <IconButton data-cy="expandButton" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <ExpandMoreIcon style={{ fontSize: '20px' }} />
            ) : (
              <ChevronRightIcon style={{ fontSize: '20px' }} />
            )}
          </IconButton>
        ) : null}
        {dataName ? <Typography variant="body1">{dataName}</Typography> : null}
      </div>
      <div
        ref={messageBoxRef}
        style={{
          position: 'relative',
          overflowY: isExpanded ? 'auto' : 'hidden',
          maxHeight: alwaysExpand || isExpanded ? 'none' : `${thresholdHeight}px`,
          borderRadius: '10px',
          paddingBottom: '4px'
        }}
      >
        <pre
          style={{
            color: SECONDARY_GRAY,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            borderRadius: '10px',
            marginTop: '8px',
            marginBottom: '0',
            fontFamily: 'inherit', // To keep the font consistent with the rest of the design
            fontSize: '15px'
          }}
        >
          {formattedData}
        </pre>
        {!isExpanded && isExpandable ? (
          <div
            style={{
              content: '',
              display: 'block',
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '20px',
              backgroundImage: 'linear-gradient(to top, rgba(40, 40, 40), rgba(0, 0, 0, 0))'
            }}
          />
        ) : null}
      </div>
    </Paper>
  );
};
