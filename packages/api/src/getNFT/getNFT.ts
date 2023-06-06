import {
  GEM_WALLET,
  GetNFTResponse,
  GetNFTRequest,
  RequestGetNFTMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getNFT = async (payload?: GetNFTRequest): Promise<GetNFTResponse> => {
  /* response:
   * if the transaction succeeds:
   * - type: 'response'
   * - result:
   *    - account_nfts: array of NFTs
   *    - marker: Value from a previous paginated response. Resume retrieving data where that response left off.
   *
   * if the user rejects the transaction:
   * - type: 'reject'
   * - result: undefined
   *
   * if the transaction fails:
   * - throw an error
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
