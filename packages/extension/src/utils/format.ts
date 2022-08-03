export const formatToken = (value: number, currency: string) => {
  const minimumFractionDigits = value.toString().split('.')[1]?.length || 0;
  const tempCurrency = 'XRP';
  let formattedToken = new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: tempCurrency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits
  }).format(value);
  return `${formattedToken.replace(/\s?XRP\s?/, '')} ${currency.toUpperCase()}`;
};
