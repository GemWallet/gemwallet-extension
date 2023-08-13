import { ComponentProps } from 'react';

import { Typography } from '@mui/material';

type TruncatedTextProps = ComponentProps<typeof Typography> & {
  text?: string;
};

export const TruncatedText = ({
  text = '',
  sx,
  variant = 'body1',
  ...rest
}: TruncatedTextProps) => {
  return (
    <Typography
      sx={{
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
        ...sx
      }}
      {...rest}
      variant={variant}
    >
      {text}
    </Typography>
  );
};
