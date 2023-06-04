import {
  GEM_WALLET,
  GetNFTResponse,
  GetNFTRequest,
  RequestGetNFTMessage,
  ResponseType
} from '@gemwallet/constants';
import { deserializeError } from '@gemwallet/extension/src/utils/errors';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getNFT = async (payload?: GetNFTRequest): Promise<GetNFTResponse> => {
  /* AccountNFToken[]: array of NFTs
   * null: user refused to share his NFTs
   * undefined: something went wrong
   */
  let response: GetNFTResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

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
    const { result, error } = await sendMessageToContentScript(message);
    const parsedError = error ? deserializeError(error) : undefined;
    if (parsedError) {
      throw parsedError;
    }

    if (result) {
      response.type = ResponseType.Response;
      response.result = result;
    }
  } catch (e) {
    throw e;
  }

  return response;
};
