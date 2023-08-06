import { isImageUrl } from './image';

describe('isImageUrl', () => {
  it('returns true for png image URLs', () => {
    const url = 'http://example.com/image.png';
    expect(isImageUrl(url)).toBeTruthy();
  });

  it('returns true for jpg image URLs', () => {
    const url = 'http://example.com/image.jpg';
    expect(isImageUrl(url)).toBeTruthy();
  });

  it('returns true for jpeg image URLs', () => {
    const url = 'http://example.com/image.jpeg';
    expect(isImageUrl(url)).toBeTruthy();
  });

  it('returns true for gif image URLs', () => {
    const url = 'http://example.com/image.gif';
    expect(isImageUrl(url)).toBeTruthy();
  });

  it('returns true for tif image URLs', () => {
    const url = 'http://example.com/image.tif';
    expect(isImageUrl(url)).toBeTruthy();
  });

  it('returns true for tiff image URLs', () => {
    const url = 'http://example.com/image.tiff';
    expect(isImageUrl(url)).toBeTruthy();
  });

  it('returns true for bmp image URLs', () => {
    const url = 'http://example.com/image.bmp';
    expect(isImageUrl(url)).toBeTruthy();
  });

  it('returns false for non-image URLs', () => {
    const url = 'http://example.com/image.txt';
    expect(isImageUrl(url)).toBeFalsy();
  });

  it('returns false for URLs without an extension', () => {
    const url = 'http://example.com/image';
    expect(isImageUrl(url)).toBeFalsy();
  });
});
