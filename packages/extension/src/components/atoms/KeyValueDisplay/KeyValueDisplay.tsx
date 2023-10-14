import { FC } from 'react';

import { Paper, Tooltip, Typography, TypographyProps } from '@mui/material';

interface KeyValueDisplayProps {
  keyName: string;
  value: string;
  keyTypographyProps?: TypographyProps;
  valueTypographyProps?: TypographyProps;
  hasTooltip?: boolean;
  useLegacy?: boolean;
}

const valueTypoStyle = {
  marginBottom: '10px',
  fontSize: '1.1rem'
};

export const KeyValueDisplay: FC<KeyValueDisplayProps> = ({
  keyName,
  value,
  hasTooltip,
  useLegacy
}) => {
  if (useLegacy) {
    return (
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography>{keyName}:</Typography>
        {hasTooltip ? (
          <Tooltip title={value}>
            <Typography style={valueTypoStyle}>
              <pre
                style={{
                  margin: 0,
                  color: 'white',
                  fontFamily: 'Arial, sans-serif',
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {value}
              </pre>
            </Typography>
          </Tooltip>
        ) : (
          <Typography style={valueTypoStyle}>
            <pre
              style={{
                margin: 0,
                color: 'white',
                fontFamily: 'Arial, sans-serif',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {value}
            </pre>
          </Typography>
        )}
      </Paper>
    );
  }

  return (
    <>
      <Typography>{keyName}</Typography>
      {hasTooltip ? (
        <Tooltip title={value}>
          <Typography style={valueTypoStyle}>
            <pre style={{ margin: 0, color: 'white', fontFamily: 'Arial, sans-serif' }}>
              {value}
            </pre>
          </Typography>
        </Tooltip>
      ) : (
        <Typography style={valueTypoStyle}>
          <pre style={{ margin: 0, color: 'white', fontFamily: 'Arial, sans-serif' }}>{value}</pre>
        </Typography>
      )}
    </>
  );
};
