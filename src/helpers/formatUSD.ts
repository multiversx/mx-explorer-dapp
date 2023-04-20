import BigNumber from 'bignumber.js';

export const formatUSD = ({
  amount,
  usd,
  digits,
  showPrefix = true
}: {
  amount: string | number;
  usd?: string | number;
  digits?: number;
  showPrefix?: boolean;
}) => {
  const value = new BigNumber(amount).times(usd ? new BigNumber(usd) : 1);

  return `${
    showPrefix ? (value.isGreaterThan(0) ? '≈' : '=') : ''
  } $${value.toFormat(digits)}`;
};
