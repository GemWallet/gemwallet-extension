export interface AccountNFToken {
  Flags: number;
  Issuer: string;
  NFTokenID: string;
  NFTokenTaxon: number;
  URI?: string;
  nft_serial: number;
}

export interface AccountNFTokenResponse {
  account_nfts: AccountNFToken[];
  marker?: unknown;
}

export interface NFTData {
  NFTokenID: string;

  // XLS-24 standard fields
  nftType?: string;
  schema?: string;
  name?: string;
  description?: string;
  image?: string;
  collection?: {
    name?: string;
    family?: string;
  };
}

export interface NFTokenIDResponse {
  hash: string;
  NFTokenID: string;
}
