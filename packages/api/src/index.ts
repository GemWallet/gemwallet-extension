export * from './getAddress';
export * from './getNetwork';
export * from './getNFT';
export * from './getPublicKey';
export * from './isInstalled';
export * from './sendPayment';
export * from './setTrustline';
export * from './signMessage';

export type { Amount, IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';
export type {
  AccountNFToken,
  Memo,
  Network,
  PaymentFlags,
  TrustSetFlags
} from '@gemwallet/constants';

// API request types
export type {
  GetNetworkRequest,
  GetNFTRequest,
  SendPaymentRequest,
  SetTrustlineRequest,
  SignMessageRequest
} from '@gemwallet/constants';

// API response types
export type {
  GetAddressResponse,
  GetNetworkResponse,
  GetNFTResponse,
  GetPublicKeyResponse,
  IsInstalledResponse,
  SendPaymentResponse,
  SetTrustlineResponse,
  SignMessageResponse
} from '@gemwallet/constants';

// Helpers
export { dropsToXrp, xrpToDrops } from 'xrpl/dist/npm/utils/xrpConversion';
export { stringToHex, hexToString } from './helpers/crypto';
