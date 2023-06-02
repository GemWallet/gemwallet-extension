import { FC, useCallback, useMemo } from 'react';

import * as Sentry from '@sentry/react';

import {
  GEM_WALLET,
  ReceiveGetAddressBackgroundMessage,
  ReceiveGetAddressBackgroundMessageDeprecated
} from '@gemwallet/constants';

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

  const receivingMessage = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('requestMessage') === 'REQUEST_GET_ADDRESS/V3'
      ? 'RECEIVE_GET_ADDRESS/V3'
      : 'RECEIVE_ADDRESS';
  }, []);

  const { id, url } = payload;
  const handleSendMessage = useCallback(
    (messagePayload: { publicAddress: string | null | undefined }) => {
      let message:
        | ReceiveGetAddressBackgroundMessage
        | ReceiveGetAddressBackgroundMessageDeprecated = {
        app: GEM_WALLET,
        type: 'RECEIVE_ADDRESS',
        payload: {
          id,
          publicAddress: messagePayload.publicAddress
        }
      };

      if (receivingMessage === 'RECEIVE_GET_ADDRESS/V3') {
        message = {
          app: GEM_WALLET,
          type: receivingMessage,
          payload: {
            id,
            result: messagePayload.publicAddress
              ? {
                  address: messagePayload.publicAddress
                }
              : messagePayload.publicAddress === null
              ? null
              : undefined
          }
        };
      }

      chrome.runtime
        .sendMessage(message)
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
    handleSendMessage({ publicAddress: null });
  }, [handleSendMessage]);

  const handleShare = useCallback(() => {
    saveTrustedApp({ url: String(url), permissions }, selectedWallet);
    const currentWallet = getCurrentWallet();
    handleSendMessage({ publicAddress: currentWallet?.publicAddress });
  }, [getCurrentWallet, handleSendMessage, selectedWallet, url]);

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
