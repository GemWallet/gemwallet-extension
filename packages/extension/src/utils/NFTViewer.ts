export const parseImage = (NFTData: any, URL: string): string => {
  if (NFTData.image) {
    return replaceIPFS(NFTData.image);
  }

  if (NFTData.image_url) {
    return replaceIPFS(NFTData.image_url);
  }

  return URL.replace('.json', '.png');
};

const replaceIPFS = (inputStr: string): string => {
  if (!inputStr.startsWith('ipfs://' || 'https://ipfs.io/ipfs/')) {
    return `https://ipfs.io/ipfs/${inputStr}`;
  }

  return inputStr
    .replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/')
    .replace('ipfs://', 'https://ipfs.io/ipfs/');
};

export const parseJSON = async (URL: any, NFTokenID: string): Promise<any> => {
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
