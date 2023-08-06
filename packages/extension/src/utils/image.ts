export const isImageUrl = (url: string): boolean => {
  return /\.(png|jpg|jpeg|gif|tif|tiff|bmp)$/i.test(url);
};
