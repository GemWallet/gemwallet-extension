import { FC, useCallback, useMemo } from 'react';

import * as Sentry from '@sentry/react';

import { GEM_WALLET, ReceivePublicKeyBackgroundMessage } from '@gemwallet/constants';

import { useBrowser, useWallet } from '../../../contexts';
import { saveTrustedApp, Permission } from '../../../utils';
import { SharingPage } from '../../templates';

const permissions = [Permission.Address, Permission.PublicKey];

export const SharePublicKey: FC = () => {
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
      .sendMessage<ReceivePublicKeyBackgroundMessage>({
        app: GEM_WALLET,
        type: 'RECEIVE_PUBLIC_KEY',
        payload: {
          id,
          address: null,
          publicKey: null
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
      .sendMessage<ReceivePublicKeyBackgroundMessage>({
        app: GEM_WALLET,
        type: 'RECEIVE_PUBLIC_KEY',
        payload: {
          id,
          address: currentWallet?.publicAddress,
          publicKey: currentWallet?.wallet.publicKey
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
      title="Share your public key"
      permissions={permissions}
      permissionDetails={['View your public key', 'View your address']}
      handleShare={handleShare}
      handleReject={handleReject}
    />
  );
};
