import { FC } from 'react';
import Lottie from 'lottie-react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useBrowser } from '../../../contexts';
import loading from '../../../assets/loading.json';
import alert from '../../../assets/alert.json';
import check from '../../../assets/check.json';
import { TransactionStatus } from '../../../types';

export interface AsyncTransactionProps {
  title: string;
  subtitle: React.ReactNode;
  transaction: TransactionStatus;
}

type LogoStyle = {
  width: string;
  height: string;
  marginTop?: string;
};

export const AsyncTransaction: FC<AsyncTransactionProps> = ({ title, subtitle, transaction }) => {
  const { window, closeExtension } = useBrowser();
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        padding: '20px 16px'
      }}
    >
      <Lottie
        animationData={animation}
        loop={transaction === TransactionStatus.Pending}
        style={styleAnimation}
      />
      <div style={{ marginBottom: '80px' }}>
        <Typography variant="h5" component="h1" align="center">
          {title}
        </Typography>
        <Typography variant="body1" align="center" style={{ marginTop: '10px' }}>
          {subtitle}
        </Typography>
      </div>
      <Button
        fullWidth
        variant="contained"
        disabled={
          transaction === TransactionStatus.Pending || transaction === TransactionStatus.Waiting
        }
        color={transaction === TransactionStatus.Rejected ? 'secondary' : 'primary'}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </Container>
  );
};
