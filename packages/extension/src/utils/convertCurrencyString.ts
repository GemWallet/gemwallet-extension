export const convertCurrencyString = (currency: string): string => {
  if (currency.length !== 40) {
    return currency;
  }
  // Split the currency string into two-character codes and convert them to corresponding characters using their hexadecimal values
  const currencyChars = currency.match(/.{2}/g);
  if (!currencyChars) {
    return currency;
  }
  return currencyChars.map((charCode) => String.fromCharCode(parseInt(charCode, 16))).join('');
};
