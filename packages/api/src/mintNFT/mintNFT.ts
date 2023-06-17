import {
  GEM_WALLET,
  MintNFTRequest,
  MintNFTResponse,
  RequestMintNFTMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const mintNFT = async (payload: MintNFTRequest): Promise<MintNFTResponse> => {
  /* response:
   * if the transaction succeeds:
   * - type: 'response'
   * - result:
   *    - NFTokenID: ID of the NFT
   *    - URI: URI of the NFT
   *    - hash: transaction hash
   *
   * if the user rejects the transaction:
   * - type: 'reject'
   * - result: undefined
   *
   * if the transaction fails:
   * - throw an error
   */
  let response: MintNFTResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestMintNFTMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_MINT_NFT/V3',
      payload
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
