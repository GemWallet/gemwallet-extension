import { FC, useCallback, useMemo } from 'react';

import * as Sentry from '@sentry/react';

import { GEM_WALLET, ReceiveNFTBackgroundMessage } from '@gemwallet/constants';

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

  const { id, url, limit, marker } = payload;

  const handleSendMessage = useCallback(
    (nfts: any) => {
      chrome.runtime
        .sendMessage<ReceiveNFTBackgroundMessage>({
          app: GEM_WALLET,
          type: 'RECEIVE_NFT',
          payload: {
            id,
            nfts
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
    },
    [closeExtension, extensionWindow?.id, id]
  );

  const handleReject = useCallback(() => {
    handleSendMessage(null);
  }, [handleSendMessage]);

  const handleShare = useCallback(async () => {
    try {
      saveTrustedApp({ url: String(url), permissions }, selectedWallet);
      const nfts = await getNFTs({ limit, marker });
      handleSendMessage(nfts);
    } catch (e) {
      // Returns an empty array if the account is not activated
      if ((e as Error).message === 'Account not found.') {
        handleSendMessage([]);
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
