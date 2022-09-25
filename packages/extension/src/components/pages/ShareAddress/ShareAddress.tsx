import { FC, useCallback, useMemo } from 'react';
import { GEM_WALLET, Message } from '@gemwallet/constants';
import { SharingPage } from '../../templates';
import { saveTrustedApp, Permission } from '../../../utils';
import { useBrowser, useLedger } from '../../../contexts';

const permissions = [Permission.Address];

export const ShareAddress: FC = () => {
  const { getCurrentWallet, selectedWallet } = useLedger();
  const { window: extensionWindow, closeExtension } = useBrowser();

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

  const { id, url } = payload;

  const handleReject = useCallback(() => {
    chrome.runtime
      .sendMessage({
        app: GEM_WALLET,
        type: Message.ReceiveAddress,
        payload: {
          id,
          publicAddress: null
        }
      })
      .then(() => {
        if (extensionWindow?.id) {
          closeExtension({ windowId: Number(extensionWindow.id) });
        }
      });
  }, [closeExtension, extensionWindow?.id, id]);

  const handleShare = useCallback(() => {
    saveTrustedApp({ url: String(url), permissions }, selectedWallet);
    const currentWallet = getCurrentWallet();
    chrome.runtime
      .sendMessage({
        app: GEM_WALLET,
        type: Message.ReceiveAddress,
        payload: {
          id,
          publicAddress: currentWallet?.publicAddress
        }
      })
      .then(() => {
        if (extensionWindow?.id) {
          closeExtension({ windowId: Number(extensionWindow.id) });
        }
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
