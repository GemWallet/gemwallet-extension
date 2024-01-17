import {
  SetHookRequest,
  SetHookResponse,
  GEM_WALLET,
  RequestSetHookMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const setHook = async (payload: SetHookRequest): Promise<SetHookResponse> => {
  let response: SetHookResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestSetHookMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SET_HOOK/V3',
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
