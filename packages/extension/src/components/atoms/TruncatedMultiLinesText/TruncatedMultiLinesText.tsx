import { ComponentProps } from 'react';

import Typography from '@mui/material/Typography';

type TruncatedMultiLinesTextProps = ComponentProps<typeof Typography> & {
  text?: string;
  maxLines?: string;
};

export const TruncatedMultiLinesText = ({
  text = '',
  maxLines = '4',
  sx,
  variant = 'body1'
}: TruncatedMultiLinesTextProps) => {
  return (
    <Typography
      sx={{
        overflow: 'hidden',
        display: '-webkit-box',
        width: '100%',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': maxLines /* start showing ellipsis when X line is reached */,
        'white-space': 'pre-wrap' /* let the text wrap preserving spaces */,
        ...sx
      }}
      variant={variant}
    >
      {text}
    </Typography>
  );
};
