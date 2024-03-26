import BigNumber from 'bignumber.js';
import { DIGITS } from 'config';
import { formatBigNumber } from 'helpers';

export interface FormatUSDType {
  amount: string | number;
  usd?: string | number;
  digits?: number;
  showPrefix?: boolean;
  showLastNonZeroDecimal?: boolean;
}

export const formatUSD = ({
  amount,
  usd,
  digits = DIGITS,
  showPrefix = true,
  showLastNonZeroDecimal
}: FormatUSDType) => {
  const value = new BigNumber(amount).times(usd ? new BigNumber(usd) : 1);

  const displayValue = showLastNonZeroDecimal
    ? formatBigNumber({ value, digits })
    : value.toFormat(digits);

  return `${
    showPrefix ? (value.isGreaterThan(0) ? '~' : '=') : ''
  }$${displayValue}`;
};
