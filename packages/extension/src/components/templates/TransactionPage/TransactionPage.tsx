import { FC } from 'react';

import { Container } from '@mui/material';

import { NETWORK_BANNER_HEIGHT } from '../../../constants';
import { useNetwork } from '../../../contexts';
import { TransactionTextDescription } from '../../atoms';
import { ActionButtons, TransactionHeader } from '../../molecules';

export interface TransactionPageProps {
  title: string;
  description?: string;
  url?: string | null;
  favicon?: string;
  onClickApprove: () => void;
  onClickReject: () => void;
}

export const TransactionPage: FC<TransactionPageProps> = ({
  title,
  description,
  url,
  favicon,
  children,
  onClickReject,
  onClickApprove
}) => {
  const { hasOfflineBanner } = useNetwork();

  return (
    <>
      <Container
        component="main"
        style={{
          ...(hasOfflineBanner ? { position: 'fixed', top: NETWORK_BANNER_HEIGHT } : {}),
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '24px',
          paddingLeft: '18px',
          paddingRight: '18px',
          overflowY: 'auto',
          height: 'auto',
          paddingBottom: '100px',
          backgroundColor: '#121212',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        }}
      >
        <TransactionHeader title={title} favicon={favicon} url={url} />
        {description ? <TransactionTextDescription text={description} /> : null}
        {children}
      </Container>
      <ActionButtons
        onClickReject={onClickReject}
        onClickApprove={onClickApprove}
        headerText="Only sign messages with a website you trust."
      />
    </>
  );
};
