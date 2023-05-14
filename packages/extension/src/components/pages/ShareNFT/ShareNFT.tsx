import { FC, useCallback, useMemo } from 'react';

import * as Sentry from '@sentry/react';

import {
  AccountNFToken,
  GEM_WALLET,
  ReceiveGetNFTBackgroundMessage,
  ReceiveGetNFTBackgroundMessageDeprecated
} from '@gemwallet/constants';

import { useBrowser, useLedger, useWallet } from '../../../contexts';
import { Permission, saveTrustedApp } from '../../../utils';
import { SharingPage } from '../../templates';

const permissions = [Permission.NFTs];

export const ShareNFT: FC = () => {
  const { getNFTs } = useLedger();
  const { selectedWallet } = useWallet();
  const { window: extensionWindow, closeExtension } = useBrowser();

  const payload = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return {
      id: Number(urlParams.get('id')) ?? 0,
      url: urlParams.get('url'),
      limit: Number(urlParams.get('limit')) ?? undefined,
      marker: urlParams.get('marker') ?? undefined
    };
  }, []);

  const receivingMessage = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('requestMessage') === 'REQUEST_GET_NFT/V3'
      ? 'RECEIVE_GET_NFT/V3'
      : 'RECEIVE_NFT';
  }, []);

  const { id, url, limit, marker } = payload;

  const handleSendMessage = useCallback(
    (messagePayload: { nfts: AccountNFToken[]; marker?: unknown } | null | undefined) => {
      let message: ReceiveGetNFTBackgroundMessageDeprecated | ReceiveGetNFTBackgroundMessage = {
        app: GEM_WALLET,
        type: 'RECEIVE_NFT',
        payload: {
          id,
          nfts: !!messagePayload ? messagePayload.nfts : messagePayload
        }
      };

      if (receivingMessage === 'RECEIVE_GET_NFT/V3') {
        message = {
          app: GEM_WALLET,
          type: receivingMessage,
          payload: {
            id,
            nfts: !!messagePayload
              ? {
                  account_nfts: messagePayload.nfts,
                  marker: messagePayload.marker
                }
              : messagePayload
          }
        };
      }

      chrome.runtime
        .sendMessage<ReceiveGetNFTBackgroundMessageDeprecated | ReceiveGetNFTBackgroundMessage>(
          message
        )
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
    handleSendMessage(null);
  }, [handleSendMessage]);

  const handleShare = useCallback(async () => {
    try {
      saveTrustedApp({ url: String(url), permissions }, selectedWallet);
      const { account_nfts: nfts, marker: newMarker } = await getNFTs({ limit, marker });
      handleSendMessage({ nfts, marker: newMarker });
    } catch (e) {
      // Returns an empty array if the account is not activated
      if ((e as Error).message === 'Account not found.') {
        handleSendMessage({ nfts: [] });
      } else {
        handleSendMessage(undefined);
      }
      Sentry.captureException(e);
    }
  }, [getNFTs, handleSendMessage, limit, marker, selectedWallet, url]);

  return (
    <SharingPage
      title="Share your NFTs"
      permissions={permissions}
      permissionDetails={['View your NFTs']}
      handleShare={handleShare}
      handleReject={handleReject}
    />
  );
};
