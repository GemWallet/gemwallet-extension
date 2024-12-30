import { parseImage, parseJSON } from './NFTViewer';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

vi.doMock('./NFTViewer', () => ({
  parseImage: vi.fn()
}));

describe('parseImage function', () => {
  it('returns replaced NFTData.image when it exists', () => {
    const mockNFTData = { image: 'ipfs://someImageHash' };
    const mockURL = 'https://someUrl.json';
    const result = parseImage(mockNFTData, mockURL);
    expect(result).toBe('https://ipfs.io/ipfs/someImageHash');
  });

  it('returns replaced NFTData.image_url when image does not exist but image_url does', () => {
    const mockNFTData = { image_url: 'ipfs://someImageHash' };
    const mockURL = 'https://someUrl.json';
    const result = parseImage(mockNFTData, mockURL);
    expect(result).toBe('https://ipfs.io/ipfs/someImageHash');
  });

  it('returns replaced URL when neither image nor image_url exist in NFTData', () => {
    const mockNFTData = {};
    const mockURL = 'https://someUrl.json';
    const result = parseImage(mockNFTData, mockURL);
    expect(result).toBe('https://someUrl.png');
  });
});

describe('parseJSON function', () => {
  beforeEach(() => {
    // Mock the global fetch function
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ name: 'Mock NFT' })
      } as Response)
    );
  });

  afterEach(() => {
    // Clear all instances and calls to the fetch mock
    vi.clearAllMocks();
  });

  it('returns NFT data with added properties', async () => {
    const mockUrl = 'https://someUrl.json';
    const mockNFTokenID = '123';
    const expectedResult = {
      name: 'Mock NFT',
      NFTokenID: '123',
      image: 'https://someUrl.png'
    };

    const result = await parseJSON(mockUrl, mockNFTokenID);
    expect(result).toEqual(expectedResult);
    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
  });

  it('throws an error when the fetch promise rejects', async () => {
    // Mock the fetch function to reject with an error
    global.fetch = vi.fn(() => Promise.reject('Error'));

    const mockUrl = 'https://someUrl.json';
    const mockNFTokenID = '123';

    await expect(parseJSON(mockUrl, mockNFTokenID)).rejects.toThrow('Error fetching NFT data');
    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
  });
});
