export const truncateAddress = (address: string): string => {
  const firstCharacters = address.substring(0, 4);
  const lastCharacters = address.substring(address.length - 5, address.length - 1);
  return `${firstCharacters}...${lastCharacters}`;
};
