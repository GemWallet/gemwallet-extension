import { convertHexToString } from 'xrpl';

import { AccountNFToken } from '@gemwallet/constants';

import { resolveNFTImage } from './NFTImageResolver';
import { parseJSON } from './NFTViewer';

jest.mock('xrpl');
jest.mock('./NFTViewer');

describe('resolveNFTImage', () => {
  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    mockFetch = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  it('should return NFTokenID and description if URI is empty', async () => {
    const NFT = {
      NFTokenID: '1234',
      URI: ''
    };
    const result = await resolveNFTImage(NFT as AccountNFToken);
    expect(result).toEqual({
      NFTokenID: '1234',
      description: 'No data'
    });
  });

  it('should return NFTokenID and image URL if URL is a PNG image', async () => {
    // @ts-ignore
    convertHexToString.mockResolvedValueOnce('https://test.com/image.png');
    mockFetch.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));
    const NFT = {
      NFTokenID: '1234',
      URI: 'mockHex'
    };
    const result = await resolveNFTImage(NFT as AccountNFToken);
    expect(result).toEqual({
      NFTokenID: '1234',
      image: 'https://test.com/image.png'
    });
  });

  it('should return NFTokenID and image URL if URL is a JPG image', async () => {
    // @ts-ignore
    convertHexToString.mockResolvedValueOnce('https://test.com/image.jpg');
    mockFetch.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));
    const NFT = {
      NFTokenID: '1234',
      URI: 'mockHex'
    };
    const result = await resolveNFTImage(NFT as AccountNFToken);
    expect(result).toEqual({
      NFTokenID: '1234',
      image: 'https://test.com/image.jpg'
    });
  });

  it('should return parsed JSON if URL is a JSON', async () => {
    // @ts-ignore
    convertHexToString.mockResolvedValueOnce('https://test.com/data.json');
    mockFetch.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));
    // @ts-ignore
    parseJSON.mockResolvedValueOnce({ name: 'test' });
    const NFT = {
      NFTokenID: '1234',
      URI: 'mockHex'
    };
    const result = await resolveNFTImage(NFT as AccountNFToken);
    expect(result).toEqual({ name: 'test' });
  });

  it('should return raw NFT attributes if URL fetch fails', async () => {
    // @ts-ignore
    convertHexToString.mockResolvedValueOnce('ipfs://testData');
    mockFetch.mockRejectedValueOnce(new Error('fetch error'));
    const NFT = {
      NFTokenID: '1234',
      URI: 'mockHex'
    };
    const result = await resolveNFTImage(NFT as AccountNFToken);
    expect(result).toEqual({
      NFTokenID: '1234',
      description: 'ipfs://testData'
    });
  });

  it('should return parsed JSON if URL is an IPFS URL and fetch is successful', async () => {
    // @ts-ignore
    convertHexToString.mockResolvedValueOnce('ipfs://testData');
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ name: 'test' }), { status: 200 }));
    // @ts-ignore
    parseJSON.mockResolvedValueOnce({ name: 'test' });
    const NFT = {
      NFTokenID: '1234',
      URI: 'mockHex'
    };
    const result = await resolveNFTImage(NFT as AccountNFToken);
    expect(result).toEqual({ name: 'test' });
  });

  it('should return raw NFT attributes if URL fetch from IPFS fails', async () => {
    // @ts-ignore
    convertHexToString.mockResolvedValueOnce('ipfs://testData');
    mockFetch.mockRejectedValueOnce(new Error('fetch error'));
    const NFT = {
      NFTokenID: '1234',
      URI: 'mockHex'
    };
    const result = await resolveNFTImage(NFT as AccountNFToken);
    expect(result).toEqual({
      NFTokenID: '1234',
      description: 'ipfs://testData'
    });
  });
});
