export * from './getAddress';
export * from './getNetwork';
export * from './getNFT';
export * from './getPublicKey';
export * from './isConnected';
export * from './sendPayment';
export * from './setTrustline';
export * from './signMessage';

export type { Amount } from 'xrpl/dist/npm/models/common';
export type { AccountNFToken, Memo, PaymentFlags, TrustSetFlags } from '@gemwallet/constants';

// API return types
export type {
  GetAddressResponse,
  GetNetworkResponse,
  GetNFTResponse,
  GetPublicKeyResponse,
  IsConnectedResponse,
  SendPaymentResponse,
  SetTrustlineResponse,
  SignMessageResponse
} from '@gemwallet/constants';
