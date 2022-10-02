import { GEM_WALLET, GetAddressMessage, Message } from '@gemwallet/constants';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const getAddress = async () => {
  /* string: classic address
   * null: user refused the authorization
   * undefined: something went wrong
   */
  let response: string | undefined | null = undefined;
  try {
    let favicon = document.querySelector("link[rel*='icon']")?.getAttribute('href');
    if (favicon) {
      try {
        new URL(favicon);
      } catch (e) {
        favicon = window.location.origin + favicon;
      }
    }
    const message: GetAddressMessage = {
      app: GEM_WALLET,
      type: Message.RequestAddress,
      payload: {
        url: window.location.origin,
        title: document.title,
        favicon
      }
    };
    const { publicAddress } = await sendMessageToContentScript(message);
    response = publicAddress;
  } catch (e) {
    throw e;
  }

  return response;
};
