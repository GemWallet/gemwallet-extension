import * as Sentry from '@sentry/react';
import { convertHexToString } from 'xrpl';
import { AccountInfoResponse } from 'xrpl/dist/npm/models/methods/accountInfo';

import { AccountNFToken, NFTData } from '@gemwallet/constants';
import { IPFSResolverPrefix } from '@gemwallet/constants/src/xrpl/nft.constant';

import { parseJSON } from './NFTViewer';

import { isImageUrl } from '.';

export const resolveNFTData = async (
  NFT: AccountNFToken,
  getAccountInfo: (accountId?: string) => Promise<AccountInfoResponse>
): Promise<NFTData> => {
  const { NFTokenID, URI } = NFT;
  let URL = URI ? convertHexToString(URI) : '';

  if (!URL.length) {
    // Handle the domain field method
    try {
      const { result } = await getAccountInfo(NFT.Issuer);
      const domain = result.account_data.Domain;
      if (!domain) {
        return {
          NFTokenID,
          description: 'No data'
        };
      }

      // The base URI is in the domain field of the issuer
      URL = `${convertHexToString(domain)}${NFT.NFTokenID}.json`;
    } catch (e) {
      Sentry.captureException(e);
      return {
        NFTokenID,
        description: 'No data'
      };
    }
  }

  URL = URL.replace('ipfs://', IPFSResolverPrefix);

  // Case 1 - Image URL
  if (isImageUrl(URL)) {
    try {
      // Case 1.1 - The URL is directly an image
      await fetch(URL);
      return {
        NFTokenID,
        image: URL
      };
    } catch (e) {
      // Case 1.2 - The URL is an IPFS hash
      if (!URL.startsWith(IPFSResolverPrefix) && !URL.startsWith('http')) {
        URL = `${IPFSResolverPrefix}${URL}`;
      }
      try {
        await fetch(URL);
        return {
          NFTokenID,
          image: URL
        };
      } catch (e) {
        /* empty */
      }
    }
  } else {
    // Case 2 - JSON URL
    try {
      await fetch(URL);
      // Case 2.1 - The URL is directly a JSON
      // If it follows the XLS-24 standard, it will be automatically parsed
      return parseJSON(URL, NFTokenID);
    } catch (e) {
      /* empty */
    }
    // Case 2.2 - The URL is an IPFS hash
    if (!URL.startsWith(IPFSResolverPrefix) && !URL.startsWith('http')) {
      try {
        const resourceURL = `${IPFSResolverPrefix}${URL}`;
        const response = await fetch(resourceURL);
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          // If it follows the XLS-24 standard, it will be automatically parsed
          return parseJSON(resourceURL, NFTokenID);
        }

        if (contentType?.startsWith('image/')) {
          return {
            NFTokenID,
            image: resourceURL
          };
        }
      } catch (e) {
        /* empty */
      }
    }
  }
  // Case 3 - Return the raw NFT attributes
  return {
    NFTokenID,
    description: URI ? convertHexToString(URI) : undefined
  };
};
