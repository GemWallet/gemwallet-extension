import { useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { PropType } from './TextCopy.types';

export function TextCopy({ text, style, styleTypography }: PropType) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(text);
    setIsCopied(true);
  };

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
}
