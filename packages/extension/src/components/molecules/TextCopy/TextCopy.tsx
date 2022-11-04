import { CSSProperties, FC, useCallback, useState } from 'react';

import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { IconButton, Paper, Tooltip, Typography } from '@mui/material';
import copyToClipboard from 'copy-to-clipboard';

export interface TextCopyProps {
  text: string;
  style?: CSSProperties;
  styleTypography?: CSSProperties;
}

export const TextCopy: FC<TextCopyProps> = ({ text, style, styleTypography }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    copyToClipboard(text);
    setIsCopied(true);
  }, [text]);

  return (
    <Paper
      elevation={24}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        marginTop: '20px',
        ...style
      }}
    >
      <Typography variant="body2" style={{ textAlign: 'left', ...styleTypography }}>
        {text}
      </Typography>
      <Tooltip title="Copy">
        <IconButton size="small" edge="end" color="inherit" aria-label="Copy" onClick={handleCopy}>
          {isCopied ? <ContentPasteGoIcon color="success" /> : <ContentPasteIcon />}
        </IconButton>
      </Tooltip>
    </Paper>
  );
};
