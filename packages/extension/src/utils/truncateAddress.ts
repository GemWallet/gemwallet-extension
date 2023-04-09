export const truncateAddress = (address: string): string => {
  const firstCharacters = address.substring(0, 4);
  const lastCharacters = address.substring(address.length - 4, address.length);
  return `${firstCharacters}...${lastCharacters}`;
};
