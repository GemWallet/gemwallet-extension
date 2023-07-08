export const truncateWalletName = (name: string, maxLength: number) => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength) + '...';
  }
  return name;
};
