import { ComponentProps, FC, useMemo } from 'react';

import { SxProps, Theme, Typography } from '@mui/material';

type TruncatedTextProps = ComponentProps<typeof Typography> & {
  isMultiline?: boolean;
  maxLines?: string;
};

export const TruncatedText: FC<TruncatedTextProps> = ({
  isMultiline = false,
  maxLines = '4',
  sx,
  children,
  ...rest
}) => {
  const styleProps: SxProps<Theme> | undefined = useMemo(
    () =>
      isMultiline
        ? {
            overflow: 'hidden',
            display: '-webkit-box',
            width: '100%', // if the string is very long without spaces, it will not overflow the view
            webkitBoxOrient: 'vertical',
            webkitLineClamp: maxLines, // start showing ellipsis when X line is reached
            whiteSpace: 'pre-wrap' // let the text wrap preserving spaces
          }
        : {
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%'
          },
    [isMultiline, maxLines]
  );

  return (
    <Typography
      sx={{
        ...styleProps,
        ...sx
      }}
      {...rest}
    >
      {children}
    </Typography>
  );
};
