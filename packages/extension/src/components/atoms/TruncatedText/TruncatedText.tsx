import { ComponentProps } from 'react';

import { Typography } from '@mui/material';

type TruncatedTextProps = ComponentProps<typeof Typography> & {
  text?: string;
  isMultiline?: boolean;
  maxLines?: string;
};

export const TruncatedText = ({
  text = '',
  isMultiline = false,
  maxLines = '4', // defaults to 4 max lines
  sx,
  ...rest
}: TruncatedTextProps) => {
  let styleProps: {};

  if (isMultiline) {
    styleProps = {
      overflow: 'hidden',
      display: '-webkit-box',
      width: '100%', // if the string is very long without spaces, it will not overflow the view
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': maxLines, // start showing ellipsis when X line is reached
      'white-space': 'pre-wrap' // let the text wrap preserving spaces
    };
  } else {
    // mode is 'width'
    styleProps = {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '100%'
    };
  }

  return (
    <Typography
      sx={{
        ...styleProps,
        ...sx
      }}
      {...rest}
    >
      {text}
    </Typography>
  );
};
