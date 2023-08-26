import { convertStringToHex } from 'xrpl';

import { IPFSResolverPrefix } from '@gemwallet/constants/src/xrpl/nft.constant';

import { resolveNFTData } from './NFTDataResolver';

describe('resolveNFTData', () => {
  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    mockFetch = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  it('should return NFTokenID and description if URI is empty', async () => {
    const result = await resolveNFTData(
      {
        NFTokenID: '1234',
        Flags: 0,
        Issuer: '',
        NFTokenTaxon: 0,
        nft_serial: 0
      },
      jest.fn()
    );
    expect(result).toEqual({
      NFTokenID: '1234',
      description: 'No data'
    });
  });

  it('should return NFTokenID and image URL if URL is a PNG image', async () => {
    mockFetch.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));
    const result = await resolveNFTData(
      {
        NFTokenID: '1234',
        URI: convertStringToHex('https://test.com/image.png'),
        Flags: 0,
        Issuer: '',
        NFTokenTaxon: 0,
        nft_serial: 0
      },
      jest.fn()
    );
    expect(result).toEqual({
      NFTokenID: '1234',
      image: 'https://test.com/image.png'
    });
  });

  it('should return NFTokenID and image URL if URL is a JPG image', async () => {
    mockFetch.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));
    const result = await resolveNFTData(
      {
        NFTokenID: '1234',
        URI: convertStringToHex('https://test.com/image.jpg'),
        Flags: 0,
        Issuer: '',
        NFTokenTaxon: 0,
        nft_serial: 0
      },
      jest.fn()
    );
    expect(result).toEqual({
      NFTokenID: '1234',
      image: 'https://test.com/image.jpg'
    });
  });

  it('should return parsed JSON if URL is a JSON', async () => {
    mockFetch.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ description: 'Test JSON' }))
    );
    const result = await resolveNFTData(
      {
        NFTokenID: '1234',
        URI: convertStringToHex('https://test.com/data.json'),
        Flags: 0,
        Issuer: '',
        NFTokenTaxon: 0,
        nft_serial: 0
      },
      jest.fn()
    );
    expect(result).toEqual({
      NFTokenID: '1234',
      description: 'Test JSON',
      image: 'https://test.com/data.png'
    });
  });

  it('should return raw NFT attributes if URL fetch fails', async () => {
    const testJsonUrl = 'https://test.com/data.json';
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    const result = await resolveNFTData(
      {
        NFTokenID: '1234',
        URI: convertStringToHex(testJsonUrl),
        Flags: 0,
        Issuer: '',
        NFTokenTaxon: 0,
        nft_serial: 0
      },
      jest.fn()
    );

    expect(result).toEqual({
      NFTokenID: '1234',
      description: testJsonUrl.replace(IPFSResolverPrefix, 'ipfs://')
    });
  });

  it('should return raw NFT attributes if URL fetch from IPFS fails', async () => {
    const testIpfsUrl = `${IPFSResolverPrefix}someHash`;
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    const result = await resolveNFTData(
      {
        NFTokenID: '1234',
        URI: convertStringToHex(testIpfsUrl),
        Flags: 0,
        Issuer: '',
        NFTokenTaxon: 0,
        nft_serial: 0
      },
      jest.fn()
    );

    expect(result).toEqual({
      NFTokenID: '1234',
      description: testIpfsUrl
    });
  });
});
