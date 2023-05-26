import {
  GEM_WALLET,
  GetNFTResponse,
  GetNFTRequest,
  RequestGetNFTMessage
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getNFT = async (payload?: GetNFTRequest): Promise<GetNFTResponse> => {
  /* AccountNFToken[]: array of NFTs
   * null: user refused to share his NFTs
   * undefined: something went wrong
   */
  let response: GetNFTResponse = { result: undefined };
  try {
    const favicon = getFavicon();
    const message: RequestGetNFTMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_GET_NFT/V3',
      payload: {
        url: window.location.origin,
        title: document.title,
        favicon,
        limit: payload?.limit ?? undefined,
        // Value from a previous paginated response. Resume retrieving data where that response left off.
        marker: payload?.marker ?? undefined
      }
    };
    const { nfts, marker } = await sendMessageToContentScript(message);
    response = !!nfts ? { result: { account_nfts: nfts, marker: marker } } : { result: null };
  } catch (e) {
    throw e;
  }

  return response;
};
