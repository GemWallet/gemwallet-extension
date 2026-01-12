/**
 * MPToken types for Multi-Purpose Tokens on XRPL
 */

/**
 * Raw MPToken object returned from account_objects with type: 'mptoken'
 */
export interface MPTokenObject {
  MPTokenIssuanceID: string;
  MPTAmount: string;
  Flags: number;
  LedgerEntryType: 'MPToken';
  OwnerNode?: string;
  PreviousTxnID?: string;
  PreviousTxnLgrSeq?: number;
  index: string;
}

/**
 * MPTokenIssuance object returned from ledger_entry
 */
export interface MPTokenIssuance {
  LedgerEntryType: 'MPTokenIssuance';
  Flags: number;
  Issuer: string;
  AssetScale?: number;
  MaximumAmount?: string;
  OutstandingAmount?: string;
  TransferFee?: number;
  MPTokenMetadata?: string; // Hex-encoded JSON following XLS-89 spec
  OwnerNode?: string;
  index: string;
}

/**
 * Asset class values for MPToken metadata (XLS-89 spec)
 */
export type MPTokenAssetClass = 'rwa' | 'memes' | 'wrapped' | 'gaming' | 'defi' | 'other';

/**
 * Asset subclass values for MPToken metadata (only applicable when asset_class is 'rwa')
 */
export type MPTokenAssetSubclass =
  | 'stablecoin'
  | 'commodity'
  | 'real_estate'
  | 'private_credit'
  | 'equity'
  | 'treasury'
  | 'other';

/**
 * URI object within the uris array (XLS-89 spec)
 */
export interface MPTokenURI {
  // URI value
  u?: string;
  // URI type/category
  c?: string;
  // URI title
  t?: string;
}

/**
 * Decoded MPToken metadata following XLS-89 spec
 * Short field names (t, n, d, i) and long names (ticker, name, desc, icon) are both supported
 */
export interface MPTokenMetadata {
  // Ticker/symbol (short: t, long: ticker)
  ticker?: string;
  t?: string;
  // Token name (short: n, long: name)
  name?: string;
  n?: string;
  // Description (short: d, long: desc)
  description?: string;
  d?: string;
  desc?: string;
  // Icon URL (short: i, long: icon)
  icon?: string;
  i?: string;
  // Asset class (short: ac, long: asset_class)
  assetClass?: MPTokenAssetClass;
  ac?: MPTokenAssetClass;
  asset_class?: MPTokenAssetClass;
  // Asset subclass (short: as, long: asset_subclass) - only required if asset_class is 'rwa'
  assetSubclass?: MPTokenAssetSubclass;
  as?: MPTokenAssetSubclass;
  asset_subclass?: MPTokenAssetSubclass;
  // Issuer name (short: in, long: issuer_name)
  issuerName?: string;
  in?: string;
  issuer_name?: string;
  // URIs array (short: us, long: uris)
  uris?: MPTokenURI[];
  us?: MPTokenURI[];
  // Additional info (short: ai, long: additional_info) - can be object or string
  additionalInfo?: Record<string, unknown> | string;
  ai?: Record<string, unknown> | string;
  additional_info?: Record<string, unknown> | string;
}

/**
 * Parsed MPToken data for display
 */
export interface MPTokenDisplayData {
  mptIssuanceId: string;
  balance: string;
  formattedBalance: number;
  issuer: string;
  assetScale: number;
  // Metadata fields
  ticker?: string;
  name?: string;
  description?: string;
  iconUrl?: string;
  issuerName?: string;
  // Flags
  flags: number;
  // Can be removed (balance is 0)
  canRemove: boolean;
}

/**
 * MPTokenAuthorize transaction flags
 */
export enum MPTokenAuthorizeFlags {
  tfMPTUnauthorize = 0x00000001 // 1 - Revoke authorization
}
