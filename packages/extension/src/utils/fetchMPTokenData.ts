import { Client } from 'xrpl';

import {
  MPTokenDisplayData,
  MPTokenIssuance,
  MPTokenMetadata,
  MPTokenObject
} from '../types/mptoken.types';
import { loadFromChromeSessionStorage, saveInChromeSessionStorage } from './storageChromeSession';

/**
 * Fetch all MPToken objects for an account
 */
export const fetchMPTokens = async (client: Client, address: string): Promise<MPTokenObject[]> => {
  try {
    // Use type assertion since xrpl.js doesn't have mptoken type yet
    const response = await client.request({
      command: 'account_objects',
      account: address,
      ledger_index: 'validated',
      type: 'mptoken' as 'state' // Type assertion - mptoken is not in xrpl.js types yet
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((response.result as any).account_objects as MPTokenObject[]) || [];
  } catch (error) {
    // Account not found or other error - return empty array
    console.error('Error fetching MPTokens:', error);
    return [];
  }
};

/**
 * Fetch MPTokenIssuance details from ledger
 */
export const fetchMPTokenIssuance = async (
  client: Client,
  mptIssuanceId: string
): Promise<MPTokenIssuance | null> => {
  try {
    // Check cache first
    const cacheKey = `mptIssuance-${mptIssuanceId}`;
    const cachedData = await loadFromChromeSessionStorage(cacheKey);
    if (cachedData) {
      return cachedData as MPTokenIssuance;
    }

    const response = await client.request({
      command: 'ledger_entry',
      mpt_issuance: mptIssuanceId,
      ledger_index: 'validated'
    });

    const node = response.result.node as unknown as MPTokenIssuance;
    if (node) {
      // Cache the result
      saveInChromeSessionStorage(cacheKey, node);
      return node;
    }

    return null;
  } catch (error) {
    console.error('Error fetching MPTokenIssuance:', error);
    return null;
  }
};

/**
 * Decode hex-encoded MPToken metadata to JSON
 */
export const decodeMPTokenMetadata = (hexMetadata: string): MPTokenMetadata | null => {
  try {
    const decoded = Buffer.from(hexMetadata, 'hex').toString('utf8');
    return JSON.parse(decoded) as MPTokenMetadata;
  } catch (error) {
    console.error('Error decoding MPToken metadata:', error);
    return null;
  }
};

/**
 * Extract display-friendly values from MPToken metadata
 */
const extractMetadataFields = (
  metadata: MPTokenMetadata | null
): {
  ticker?: string;
  name?: string;
  description?: string;
  iconUrl?: string;
  issuerName?: string;
} => {
  if (!metadata) {
    return {};
  }

  return {
    ticker: metadata.ticker || metadata.t,
    name: metadata.name || metadata.n,
    description: metadata.description || metadata.desc || metadata.d,
    iconUrl: metadata.icon || metadata.i,
    issuerName: metadata.issuerName || metadata.issuer_name || metadata.in
  };
};

/**
 * Format MPToken amount based on asset scale
 */
export const formatMPTokenAmount = (amount: string, assetScale: number): number => {
  const rawAmount = BigInt(amount);
  const divisor = BigInt(10 ** assetScale);
  const integerPart = rawAmount / divisor;
  const fractionalPart = rawAmount % divisor;

  // Convert to number with proper decimal places
  const fractionalStr = fractionalPart.toString().padStart(assetScale, '0');
  const formattedStr = `${integerPart}.${fractionalStr}`;

  return parseFloat(formattedStr);
};

/**
 * Get full MPToken display data by combining token object with issuance metadata
 */
export const getMPTokenDisplayData = async (
  client: Client,
  mpToken: MPTokenObject
): Promise<MPTokenDisplayData> => {
  const issuance = await fetchMPTokenIssuance(client, mpToken.MPTokenIssuanceID);

  const assetScale = issuance?.AssetScale ?? 0;
  const formattedBalance = formatMPTokenAmount(mpToken.MPTAmount, assetScale);

  let metadataFields = {};
  if (issuance?.MPTokenMetadata) {
    const metadata = decodeMPTokenMetadata(issuance.MPTokenMetadata);
    metadataFields = extractMetadataFields(metadata);
  }

  return {
    mptIssuanceId: mpToken.MPTokenIssuanceID,
    balance: mpToken.MPTAmount,
    formattedBalance,
    issuer: issuance?.Issuer || '',
    assetScale,
    ...metadataFields,
    flags: mpToken.Flags,
    canRemove: mpToken.MPTAmount === '0'
  };
};

/**
 * Fetch all MPTokens with their display data for an account
 */
export const fetchAllMPTokenDisplayData = async (
  client: Client,
  address: string
): Promise<MPTokenDisplayData[]> => {
  const mpTokens = await fetchMPTokens(client, address);

  if (mpTokens.length === 0) {
    return [];
  }

  const displayDataPromises = mpTokens.map((token) => getMPTokenDisplayData(client, token));
  const displayData = await Promise.all(displayDataPromises);

  return displayData;
};

/**
 * Truncate MPTokenIssuanceID for display
 */
export const truncateMPTIssuanceId = (
  issuanceId: string,
  prefixLength = 8,
  suffixLength = 8
): string => {
  if (issuanceId.length <= prefixLength + suffixLength + 3) {
    return issuanceId;
  }
  return `${issuanceId.slice(0, prefixLength)}...${issuanceId.slice(-suffixLength)}`;
};
