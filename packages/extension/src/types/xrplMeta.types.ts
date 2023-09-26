export type SocialLinks = {
  url: string;
  type?: 'socialmedia' | 'support';
  title?: string;
};

export type IssuerDetails = {
  domain: string;
  icon: string;
  kyc: boolean;
  name: string;
  trust_level: number;
  weblinks: SocialLinks[];
};

export type TokenDetails = {
  asset_class: string;
  description: string;
  icon: string;
  name: string;
  trust_level: number;
};

export type Metrics = {
  trustlines: number;
  holders: number;
  supply: string;
  marketcap: string;
  price: string;
  volume_24h: string;
  volume_7d: string;
  exchanges_24h: string;
  exchanges_7d: string;
  takers_24h: string;
  takers_7d: string;
};

export interface XRPLMetaTokenAPIResponse {
  currency: string;
  issuer: string;
  meta: {
    token: TokenDetails;
    issuer: IssuerDetails;
  };
  metrics: Metrics;
}

export interface XRPLMetaTokensListAPIResponse {
  tokens: XRPLMetaTokenAPIResponse[];
}
