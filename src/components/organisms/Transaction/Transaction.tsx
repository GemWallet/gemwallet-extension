import Lottie from 'lottie-react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useBrowser } from '../../../contexts/BrowserContext';
import loading from '../../../assets/loading.json';
import alert from '../../../assets/alert.json';
import check from '../../../assets/check.json';
import type { PropType, LogoStyle } from './Transaction.types';

export function Transaction({ transaction }: PropType) {
  const { window, closeExtension } = useBrowser();
  let animation: any = loading;
  let title: string = 'Transaction in progress';
  let subtitle: React.ReactNode = (
    <>
      We are processing your transaction
      <br />
      Please wait
    </>
  );
  let buttonText: string = 'Processing';
  let styleAnimation: LogoStyle = { width: '150px', height: '150px' };
  let handleClick = () => {};
  if (transaction === 'success') {
    animation = check;
    title = 'Transaction accepted';
    buttonText = 'Close';
    styleAnimation = { width: '100px', height: '100px', marginTop: '30px' };
    if (window?.id) {
      handleClick = () => closeExtension({ windowId: Number(window.id) });
    }
  }
  if (transaction === 'rejected') {
    animation = alert;
    title = 'Transaction rejected';
    subtitle = (
      <>
        Your transaction failed, please try again
        <br />
        Something went wrong
      </>
    );
    buttonText = 'Close';
    styleAnimation = { width: '70px', height: '70px', marginTop: '30px' };
    if (window?.id) {
      handleClick = () => closeExtension({ windowId: Number(window.id) });
    }
  }
  return (
    <Container
      component="main"
      fixed
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <Lottie animationData={animation} loop={transaction === 'pending'} style={styleAnimation} />
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
        disabled={transaction === 'pending'}
        color={transaction === 'rejected' ? 'secondary' : 'primary'}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </Container>
  );
}
