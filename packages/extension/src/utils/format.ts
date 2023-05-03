import { dropsToXrp } from 'xrpl';

export const formatToken = (value: number, currency: string | undefined = 'XRP', isDrops: boolean = false) => {
  if (isDrops) {
    value = Number(dropsToXrp(value))
  }

  return `${new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'XRP',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: value.toString().split('.')[1]?.length || 0
  })
    .format(value)
    .replace(/\s?XRP\s?/, '')} ${currency.toUpperCase()}`;
};
