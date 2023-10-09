import { FC, useMemo, useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { List, ListItem, ListItemText } from '@mui/material';

import { useWallet } from '../../../contexts';
import { loadTrustedApps, Permission, checkPermissions } from '../../../utils';
import { DataCard } from '../../molecules';
import { PageWithSpinner, TransactionPage } from '../../templates';

export interface SharingPageProps {
  title: string;
  permissions: Permission[];
  permissionDetails: string[];
  handleShare: () => void;
  handleReject: () => void;
}

export const SharingPage: FC<SharingPageProps> = ({
  title: titlePage,
  permissions,
  permissionDetails,
  handleShare,
  handleReject
}) => {
  const { selectedWallet } = useWallet();
  const [isExpanded, setIsExpanded] = useState(false);

  const trustedApps = useMemo(() => {
    return loadTrustedApps(selectedWallet);
  }, [selectedWallet]);

  const payload = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return {
      id: Number(urlParams.get('id')) || 0,
      url: urlParams.get('url'),
      title: urlParams.get('title'),
      favicon: urlParams.get('favicon') || undefined
    };
  }, []);

  const { url, favicon } = payload;

  const trustedApp = useMemo(() => {
    return trustedApps.filter((trustedApp) => trustedApp.url === url)[0];
  }, [trustedApps, url]);

  if (trustedApp && checkPermissions(trustedApp, permissions)) {
    handleShare();
    return <PageWithSpinner />;
  }

  return (
    <TransactionPage
      title={titlePage}
      url={url}
      favicon={favicon}
      approveButtonText="Share"
      actionButtonsDescription="Only connect with a website you trust."
      onClickApprove={handleShare}
      onClickReject={handleReject}
    >
      <DataCard
        formattedData={
          <List>
            {permissionDetails.map((permDetail) => {
              return (
                <ListItem style={{ padding: '0 16px' }} key={permDetail}>
                  <CheckIcon color="success" />
                  <ListItemText style={{ marginLeft: '10px' }} primary={permDetail} />
                </ListItem>
              );
            })}
          </List>
        }
        dataName="This app would like to"
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        thresholdHeight={300}
      />
    </TransactionPage>
  );
};
