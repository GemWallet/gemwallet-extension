import { FC, useCallback, useMemo } from 'react';

import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next';

import { GEM_WALLET, ReceiveAddressBackgroundMessage } from '@gemwallet/constants';

import { useBrowser, useWallet } from '../../../contexts';
import { saveTrustedApp, Permission } from '../../../utils';
import { SharingPage } from '../../templates';

const permissions = [Permission.Address];

export const ShareAddress: FC = () => {
  const { getCurrentWallet, selectedWallet } = useWallet();
  const { window: extensionWindow, closeExtension } = useBrowser();
  const { t } = useTranslation('common');

  const payload = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return {
      id: Number(urlParams.get('id')) || 0,
      url: urlParams.get('url')
    };
  }, []);

  const { id, url } = payload;

  const handleReject = useCallback(() => {
    chrome.runtime
      .sendMessage<ReceiveAddressBackgroundMessage>({
        app: GEM_WALLET,
        type: 'RECEIVE_ADDRESS',
        payload: {
          id,
          publicAddress: null
        }
      })
      .then(() => {
        if (extensionWindow?.id) {
          closeExtension({ windowId: Number(extensionWindow.id) });
        }
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  }, [closeExtension, extensionWindow?.id, id]);

  const handleShare = useCallback(() => {
    saveTrustedApp({ url: String(url), permissions }, selectedWallet);
    const currentWallet = getCurrentWallet();
    chrome.runtime
      .sendMessage<ReceiveAddressBackgroundMessage>({
        app: GEM_WALLET,
        type: 'RECEIVE_ADDRESS',
        payload: {
          id,
          publicAddress: currentWallet?.publicAddress
        }
      })
      .then(() => {
        if (extensionWindow?.id) {
          closeExtension({ windowId: Number(extensionWindow.id) });
        }
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  }, [closeExtension, extensionWindow?.id, getCurrentWallet, id, selectedWallet, url]);

  return (
    <SharingPage
      title={t('TEXT_SHARE_ADDRESS')}
      permissions={permissions}
      permissionDetails={[t('TEXT_VIEW_ADDRESS')]}
      handleShare={handleShare}
      handleReject={handleReject}
    />
  );
};
