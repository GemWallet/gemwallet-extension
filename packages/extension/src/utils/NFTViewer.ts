import { NFTData } from '@gemwallet/constants';
import { IPFSResolverPrefix } from '@gemwallet/constants/src/xrpl/nft.constant';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseImage = (NFTData: any, URL: string): string => {
  if (NFTData.image) {
    return replaceIPFS(NFTData.image);
  }

  if (NFTData.image_url) {
    return replaceIPFS(NFTData.image_url);
  }

  return URL.replace('.json', '.png');
};

export const parseJSON = async (URL: string, NFTokenID: string): Promise<NFTData> => {
  const NFTData = await fetch(URL)
    .then((res) => res.json())
    .catch(() => {
      throw new Error('Error fetching NFT data');
    });

  const image = parseImage(NFTData, URL);

  return {
    ...NFTData,
    NFTokenID,
    image
  };
};

const replaceIPFS = (inputStr: string): string => {
  if (!inputStr.startsWith('ipfs://' || IPFSResolverPrefix) && !inputStr.startsWith('http')) {
    return `${IPFSResolverPrefix}${inputStr}`;
  }

  return inputStr
    .replace('ipfs://ipfs/', IPFSResolverPrefix)
    .replace('ipfs://', IPFSResolverPrefix);
};
