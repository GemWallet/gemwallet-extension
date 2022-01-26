import { GEM_WALLET, REQUEST_NETWORK } from '@gemwallet/constants/src/message';
import { MessageListenerEvent } from '@gemwallet/constants/src/message.types';

chrome.runtime.onMessage.addListener((message: MessageListenerEvent, sender, sendResponse) => {
  const { app, type } = message;
  // We make sure that the message comes from gem-wallet
  if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
    if (type === REQUEST_NETWORK) {
      sendResponse('TEST');
    }
  }
});
