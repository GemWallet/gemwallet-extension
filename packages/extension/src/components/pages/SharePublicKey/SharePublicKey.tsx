import { FC, useCallback, useMemo } from 'react';

import * as Sentry from '@sentry/react';

import {
  GEM_WALLET,
  ReceivePublicKeyBackgroundMessage,
  ReceivePublicKeyBackgroundMessageDeprecated
} from '@gemwallet/constants';

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

  const receivingMessage = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('requestMessage') === 'REQUEST_GET_PUBLIC_KEY/V3'
      ? 'RECEIVE_GET_PUBLIC_KEY/V3'
      : 'RECEIVE_PUBLIC_KEY';
  }, []);

  const { id, url } = payload;
  const handleSendMessage = useCallback(
    (messagePayload: {
      address: string | null | undefined;
      publicKey: string | null | undefined;
    }) => {
      let message: ReceivePublicKeyBackgroundMessage | ReceivePublicKeyBackgroundMessageDeprecated =
        {
          app: GEM_WALLET,
          type: 'RECEIVE_PUBLIC_KEY',
          payload: {
            id,
            address: messagePayload.address,
            publicKey: messagePayload.publicKey
          }
        };

      if (receivingMessage === 'RECEIVE_GET_PUBLIC_KEY/V3') {
        message = {
          app: GEM_WALLET,
          type: receivingMessage,
          payload: {
            id,
            result:
              messagePayload.address && messagePayload.publicKey
                ? {
                    address: messagePayload.address,
                    publicKey: messagePayload.publicKey
                  }
                : messagePayload.address === null
                ? null
                : undefined
          }
        };
      }

      chrome.runtime
        .sendMessage<
          ReceivePublicKeyBackgroundMessage | ReceivePublicKeyBackgroundMessageDeprecated
        >(message)
        .then(() => {
          if (extensionWindow?.id) {
            closeExtension({ windowId: Number(extensionWindow.id) });
          }
        })
        .catch((e) => {
          Sentry.captureException(e);
        });
    },
    [closeExtension, extensionWindow?.id, id, receivingMessage]
  );

  const handleReject = useCallback(() => {
    handleSendMessage({ address: null, publicKey: null });
  }, [handleSendMessage]);

  const handleShare = useCallback(() => {
    saveTrustedApp({ url: String(url), permissions }, selectedWallet);
    handleSendMessage({
      address: getCurrentWallet()?.publicAddress,
      publicKey: getCurrentWallet()?.wallet.publicKey
    });
  }, [url, selectedWallet, handleSendMessage, getCurrentWallet]);

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
