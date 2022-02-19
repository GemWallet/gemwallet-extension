import { Network } from '@gemwallet/constants/src/network.types';

export type Params = {
  chain: 'xrp';
  network: Network;
  transaction: 'payment';
  amount: string;
  destination: string;
  token: string;
  apiVersion: number;
};
