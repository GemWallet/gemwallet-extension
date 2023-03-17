import {
  AccountNFToken,
  GEM_WALLET,
  NFTRequestPayload,
  RequestNFTMessage
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getNFT = async (payload?: NFTRequestPayload) => {
  /* AccountNFToken[]: array of NFTs
   * null: user refused to share his NFTs
   * undefined: something went wrong
   */
  let response: AccountNFToken[] | undefined | null = undefined;
  try {
    const favicon = getFavicon();
    const message: RequestNFTMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_NFT',
      payload: {
        url: window.location.origin,
        title: document.title,
        favicon,
        limit: payload?.limit ?? undefined,
        // Value from a previous paginated response. Resume retrieving data where that response left off.
        marker: payload?.marker ?? undefined
      }
    };
    const { nfts } = await sendMessageToContentScript(message);
    response = nfts;
  } catch (e) {
    throw e;
  }

  return response;
};
