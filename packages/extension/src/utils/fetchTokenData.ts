import { XRPL_META_URL } from '../constants';
import { XRPLMetaTokenAPIResponse } from '../types';
import { loadFromChromeSessionStorage, saveInChromeSessionStorage } from './storageChromeSession';

export interface TokenDisplayData {
  tokenName: string;
  tokenIconUrl?: string;
  issuerName?: string;
  issuerIconUrl?: string;
}

// API Reference: https://xrplmeta.org/api
export const getTrustLineData = async (params: {
  token: string;
  issuer: string;
}): Promise<TokenDisplayData> => {
  const { token, issuer } = params;

  try {
    const cachedData = await loadFromChromeSessionStorage<TokenDisplayData>(
      `tokenData-${token}-${issuer}`
    );
    if (cachedData) {
      return cachedData;
    }
  } catch (e) {
    // nothing
  }

  try {
    const fetchedData = fetchDataFromAPI(token, issuer);
    if (fetchedData) {
      saveInChromeSessionStorage(`tokenData-${token}-${issuer}`, fetchedData);
      return fetchedData;
    }
  } catch (e) {
    // nothing
  }

  return {
    tokenName: token
  };
};

const fetchDataFromAPI = async (token: string, issuer: string): Promise<TokenDisplayData> => {
  const res: Response = await fetch(`${XRPL_META_URL}/token/${token}:${issuer}`);
  const json: XRPLMetaTokenAPIResponse = await res.json();

  const tokenName: string | undefined = json?.meta?.token?.name ?? token;
  const tokenIconUrl: string | undefined = json?.meta?.token?.icon ?? json?.meta?.issuer?.icon;
  const issuerName: string | undefined = json?.meta?.issuer?.name;
  const issuerIconUrl: string | undefined = json?.meta?.issuer?.icon;

  const tokenData: TokenDisplayData = {
    tokenName,
    tokenIconUrl,
    issuerName,
    issuerIconUrl
  };

  return tokenData;
};
