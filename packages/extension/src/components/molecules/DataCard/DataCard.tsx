import { FC, useEffect, useRef, useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Paper, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';

interface DataCardProps {
  formattedData: any;
  dataName: string;
  isExpandable: boolean;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  thresholdHeight?: number;
}

export const DataCard: FC<DataCardProps> = ({
  formattedData,
  dataName,
  isExpanded,
  setIsExpanded,
  thresholdHeight = 120
}) => {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const [isExpandable, setIsExpandable] = useState(false);

  useEffect(() => {
    if (messageBoxRef.current && messageBoxRef.current.offsetHeight > thresholdHeight) {
      setIsExpandable(true);
    } else {
      setIsExpandable(false);
    }
  }, [formattedData, thresholdHeight]);

  return (
    <Paper
      elevation={24}
      style={{
        padding: '15px',
        marginTop: '30px',
        borderRadius: '15px',
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
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <ExpandMoreIcon style={{ fontSize: '20px' }} />
            ) : (
              <ChevronRightIcon style={{ fontSize: '20px' }} />
            )}
          </IconButton>
        ) : null}
        <Typography variant="body1">{dataName}</Typography>
      </div>
      <div
        ref={messageBoxRef}
        style={{
          position: 'relative',
          overflowY: 'auto',
          maxHeight: isExpanded ? 'none' : `${thresholdHeight}px`,
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
