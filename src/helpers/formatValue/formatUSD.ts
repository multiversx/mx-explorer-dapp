import BigNumber from 'bignumber.js';
import { amountWithoutRounding } from 'helpers';

export interface FormatUSDType {
  amount: string | number;
  usd?: string | number;
  digits?: number;
  maxDigits?: number;
  showPrefix?: boolean;
  showLastNonZeroDecimal?: boolean;
}

export const formatUSD = ({
  amount,
  usd,
  digits,
  showPrefix = true,
  maxDigits,
  showLastNonZeroDecimal
}: FormatUSDType) => {
  const value = new BigNumber(amount).times(usd ? new BigNumber(usd) : 1);

  const displayValue = showLastNonZeroDecimal
    ? amountWithoutRounding(value, digits, maxDigits)
    : value.toFormat(digits);

  return `${
    showPrefix ? (value.isGreaterThan(0) ? '~' : '=') : ''
  }$${displayValue}`;
};
