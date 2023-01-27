export const formatToken = (value: number, currency: string | undefined = 'XRP') => {
  return `${new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'XRP',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: value.toString().split('.')[1]?.length || 0
  })
    .format(value)
    .replace(/\s?XRP\s?/, '')} ${currency.toUpperCase()}`;
};
