import { ComponentProps, FC } from 'react';

import { Typography } from '@mui/material';

type TruncatedTextProps = ComponentProps<typeof Typography> & {
  text?: string;
  maxLength?: number;
};

export const TruncatedText: FC<TruncatedTextProps> = ({ text, maxLength, sx, ...rest }) => {
  if (!text) return null;

  const displayedText =
    maxLength && text.length > maxLength ? `${text.substring(0, maxLength - 3)}...` : text;

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
      variant="body1"
    >
      {displayedText}
    </Typography>
  );
};
