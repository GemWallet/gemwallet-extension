import { FC, useCallback, useMemo } from 'react';

import * as Sentry from '@sentry/react';

import { GEM_WALLET, ReceiveAddressBackgroundMessage } from '@gemwallet/constants';

import { useBrowser, useWallet } from '../../../contexts';
import { saveTrustedApp, Permission } from '../../../utils';
import { SharingPage } from '../../templates';

const permissions = [Permission.Address];

export const ShareAddress: FC = () => {
  const { getCurrentWallet, selectedWallet } = useWallet();
  const { window: extensionWindow, closeExtension } = useBrowser();

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
      title="Share your address"
      permissions={permissions}
      permissionDetails={['View your address']}
      handleShare={handleShare}
      handleReject={handleReject}
    />
  );
};
