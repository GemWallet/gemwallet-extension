import { ComponentProps } from 'react';

import Typography from '@mui/material/Typography';

type TruncatedMultiLinesTextProps = ComponentProps<typeof Typography> & {
  text?: string;
  maxLines?: string;
};

export const TruncatedMultiLinesText = ({
  text = '',
  maxLines = '4', // defaults to 4 max lines
  sx,
  ...rest
}: TruncatedMultiLinesTextProps) => {
  return (
    <Typography
      sx={{
        overflow: 'hidden',
        display: '-webkit-box',
        width: '100%', // if the string is very long without spaces, it will not overflow the view
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': maxLines, // start showing ellipsis when X line is reached
        'white-space': 'pre-wrap', //  let the text wrap preserving spaces
        ...sx
      }}
      {...rest}
    >
      {text}
    </Typography>
  );
};
