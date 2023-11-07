import { Chain } from './network.constant';

export interface NetworkData {
  name: string;
  server: string;
  chain: Chain;
  description?: string;
}
