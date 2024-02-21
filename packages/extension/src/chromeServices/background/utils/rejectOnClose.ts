import { GEM_WALLET } from '@gemwallet/constants';

const defaultPayload = {
  result: null
};

export const buildRejectMessage = (type: string): any => {
  if (type === 'RECEIVE_SEND_PAYMENT/V3' || type === 'RECEIVE_PAYMENT_HASH') {
    return {
      app: GEM_WALLET,
      type,
      payload:
        type === 'RECEIVE_SEND_PAYMENT/V3'
          ? defaultPayload
          : {
              hash: null
            }
    };
  } else if (type === 'RECEIVE_GET_ADDRESS/V3' || type === 'RECEIVE_ADDRESS') {
    return {
      app: GEM_WALLET,
      type,
      payload:
        type === 'RECEIVE_GET_ADDRESS/V3'
          ? defaultPayload
          : {
              publicAddress: null
            }
    };
  } else if (type === 'RECEIVE_GET_PUBLIC_KEY/V3' || type === 'RECEIVE_PUBLIC_KEY') {
    return {
      app: GEM_WALLET,
      type,
      payload:
        type === 'RECEIVE_GET_PUBLIC_KEY/V3'
          ? defaultPayload
          : {
              address: null,
              publicKey: null
            }
    };
    /*
     * Cypher Lab specific
     */
  } else if (type === 'RECEIVE_SIGN_ALICES_RING/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_SIGN_ALICES_RING/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_SIGN_MESSAGE/V3' || type === 'RECEIVE_SIGN_MESSAGE') {
    return {
      app: GEM_WALLET,
      type,
      payload:
        type === 'RECEIVE_SIGN_MESSAGE/V3'
          ? defaultPayload
          : {
              signedMessage: null
            }
    };
  } else if (type === 'RECEIVE_SUBMIT_TRANSACTION/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_SUBMIT_TRANSACTION/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_SIGN_TRANSACTION/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_SIGN_TRANSACTION/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_SUBMIT_BULK_TRANSACTIONS/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_SUBMIT_BULK_TRANSACTIONS/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_SET_TRUSTLINE/V3' || type === 'RECEIVE_TRUSTLINE_HASH') {
    return {
      app: GEM_WALLET,
      type,
      payload:
        type === 'RECEIVE_SET_TRUSTLINE/V3'
          ? defaultPayload
          : {
              hash: null
            }
    };
  } else if (type === 'RECEIVE_GET_NFT/V3' || type === 'RECEIVE_NFT') {
    return {
      app: GEM_WALLET,
      type,
      payload:
        type === 'RECEIVE_GET_NFT/V3'
          ? defaultPayload
          : {
              nfts: null
            }
    };
  } else if (type === 'RECEIVE_MINT_NFT/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_MINT_NFT/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_CREATE_NFT_OFFER/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_CREATE_NFT_OFFER/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_CANCEL_NFT_OFFER/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_CANCEL_NFT_OFFER/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_ACCEPT_NFT_OFFER/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_ACCEPT_NFT_OFFER/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_BURN_NFT/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_BURN_NFT/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_SET_ACCOUNT/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_SET_ACCOUNT/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_CREATE_OFFER/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_CREATE_OFFER/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_CANCEL_OFFER/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_CANCEL_OFFER/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_SET_REGULAR_KEY/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_SET_REGULAR_KEY/V3',
      payload: defaultPayload
    };
  } else if (type === 'RECEIVE_SET_HOOK/V3') {
    return {
      app: GEM_WALLET,
      type: 'RECEIVE_SET_HOOK/V3',
      payload: defaultPayload
    };
  }
};
