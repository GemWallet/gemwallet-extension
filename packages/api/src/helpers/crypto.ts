let TextEncoder = globalThis.TextEncoder;
let TextDecoder = globalThis.TextDecoder;

if (!TextEncoder) {
  const util = require('util');
  TextEncoder = util.TextEncoder;
}

if (!TextDecoder) {
  const util = require('util');
  TextDecoder = util.TextDecoder;
}

/*
 * Converts a string to hex. Used for e.g. memo fields.
 * @param str - string to convert to hex
 * @returns hex string
 */
export const stringToHex = (str: string): string => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex.toUpperCase();
};

/*
 * Converts a hex string to a string. Used to decode potentially hex-encoded fields in responses.
 */
export const hexToString = (hex: string): string => {
  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }

  const decoder = new TextDecoder();
  return decoder.decode(bytes);
};
