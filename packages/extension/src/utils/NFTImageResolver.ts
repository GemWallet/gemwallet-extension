import { convertHexToString } from 'xrpl';

import { parseJSON } from './NFTViewer';

export interface NFTData {
  NFTokenID: string;
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

export const resolveNFTImage = async (NFTokenID: string, URI: string): Promise<NFTData> => {
  let URL = URI ? await convertHexToString(String(URI)) : '';

  if (URL.length === 0) {
    return {
      NFTokenID,
      description: 'No data'
    };
  }

  URL = URL.replace('ipfs://', 'https://ipfs.io/ipfs/');

  // Case 1 - Image URL
  if (URL.includes('.png') || URL.includes('.jpg')) {
    try {
      // Case 1.1 - The URL is directly an image
      await fetch(URL);
      return {
        NFTokenID,
        image: URL
      };
    } catch (e) {
      // Case 1.2 - The URL is an IPFS hash
      if (!URL.startsWith('https://ipfs.io/ipfs/') && !URL.startsWith('http')) {
        URL = `https://ipfs.io/ipfs/${URL}`;
      }
      try {
        await fetch(URL);
        return {
          NFTokenID,
          image: URL
        };
      } catch (e) {}
    }
  } else {
    // Case 2 - JSON URL
    try {
      await fetch(URL);
      // Case 2.1 - The URL is directly a JSON
      return parseJSON(URL, NFTokenID);
    } catch (e) {}
    // Case 2.2 - The URL is an IPFS hash
    if (!URL.startsWith('https://ipfs.io/ipfs/') && !URL.startsWith('http')) {
      try {
        await fetch(`https://ipfs.io/ipfs/${URL}`);
        return parseJSON(`https://ipfs.io/ipfs/${URL}`, NFTokenID);
      } catch (e) {}
    }
  }
  // Case 3 - Return the raw NFT attributes
  return {
    NFTokenID,
    description: URL.replace('https://ipfs.io/ipfs/', 'ipfs://')
  };
};
