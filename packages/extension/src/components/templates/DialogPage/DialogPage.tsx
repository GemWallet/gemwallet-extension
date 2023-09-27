import { FC, ReactElement, Ref, forwardRef } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface DialogPageProps {
  onClickClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClose: (event: React.SyntheticEvent, reason: 'backdropClick' | 'escapeKeyDown') => void;
  open: boolean;
  title: string;
}

export const DialogPage: FC<DialogPageProps> = ({
  onClickClose,
  onClose,
  open,
  title,
  children
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullScreen TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={onClickClose}
            style={{ cursor: 'pointer' }}
            data-testid="close-button"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="p">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
};
