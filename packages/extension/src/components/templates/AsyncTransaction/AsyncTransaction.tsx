import { FC } from 'react';

import { Button, Container, LinearProgress, Typography } from '@mui/material';
import Lottie from 'lottie-react';

import alert from '../../../assets/alert.json';
import check from '../../../assets/check.json';
import loading from '../../../assets/loading.json';
import { NETWORK_BANNER_HEIGHT } from '../../../constants';
import { useBrowser, useNetwork } from '../../../contexts';
import { TransactionStatus } from '../../../types';

export interface AsyncTransactionProps {
  title: string;
  subtitle: React.ReactNode;
  transaction: TransactionStatus;
  progressPercentage?: number;
  isBulk?: boolean;
  onClick?: () => void;
}

type LogoStyle = {
  width: string;
  height: string;
  marginTop?: string;
};

export const AsyncTransaction: FC<AsyncTransactionProps> = ({
  title,
  subtitle,
  transaction,
  progressPercentage,
  isBulk,
  onClick
}) => {
  const { window, closeExtension } = useBrowser();
  const { isConnectionFailed } = useNetwork();

  let animation: object = loading;

  let buttonText: string = 'Processing';
  let styleAnimation: LogoStyle = { width: '150px', height: '150px' };
  let handleClick = () => {};
  if (transaction === TransactionStatus.Success) {
    animation = check;
    buttonText = 'Close';
    styleAnimation = { width: '100px', height: '100px', marginTop: '30px' };
    if (window?.id) {
      handleClick = () => closeExtension({ windowId: Number(window.id) });
    }
  }

  if (transaction === TransactionStatus.Rejected) {
    animation = alert;
    buttonText = 'Close';
    styleAnimation = { width: '70px', height: '70px', marginTop: '30px' };
    if (window?.id) {
      handleClick = () => closeExtension({ windowId: Number(window.id) });
    }
  }

  return (
    <Container
      component="main"
      style={{
        ...(isConnectionFailed ? { position: 'fixed', top: NETWORK_BANNER_HEIGHT } : {}),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: isConnectionFailed ? `calc(100vh - ${NETWORK_BANNER_HEIGHT}px)` : '100vh',
        padding: '20px 16px'
      }}
    >
      <Lottie
        animationData={animation}
        loop={transaction === TransactionStatus.Pending}
        style={styleAnimation}
      />
      <div style={{ marginBottom: '80px' }}>
        <Typography variant="h5" component="h1" align="center" data-testid="transaction-title">
          {title}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          style={{ marginTop: '10px' }}
          data-testid="transaction-subtitle"
        >
          {subtitle}
        </Typography>
        {transaction === TransactionStatus.Pending && isBulk ? (
          <div style={{ width: '100%', marginTop: '20px' }}>
            <LinearProgress variant="determinate" value={progressPercentage ?? 0} />
            <Typography align="center" variant="body2">
              Progress: {progressPercentage ?? 0}%
            </Typography>
          </div>
        ) : null}
      </div>
      <Button
        fullWidth
        variant="contained"
        disabled={
          transaction === TransactionStatus.Pending || transaction === TransactionStatus.Waiting
        }
        color={transaction === TransactionStatus.Rejected ? 'secondary' : 'primary'}
        onClick={onClick ?? handleClick}
      >
        {buttonText}
      </Button>
    </Container>
  );
};
