/*
 * Converts a string to hex. Used for e.g. memo fields.
 * @param str - string to convert to hex
 * @returns hex string
 */
export const stringToHex = (str: string): string => {
  return Buffer.from(str, 'utf8').toString('hex').toUpperCase();
};

/*
 * Converts a hex string to a string. Used to decode potentially hex-encoded fields in responses.
 */
export const hexToString = (hex: string): string => {
  return Buffer.from(hex, 'hex').toString('utf8');
};
