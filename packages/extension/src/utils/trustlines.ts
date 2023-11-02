/*
 * AMM Related
 */
export const LP_TOKEN_NAME = 'LP Token';

// Source: https://xrpl.org/automated-market-makers.html#lp-token-currency-codes
export const isLPToken = (hexCurrency: string): boolean => {
  return parseInt(hexCurrency.substring(0, 2), 16) === 0x03;
};
