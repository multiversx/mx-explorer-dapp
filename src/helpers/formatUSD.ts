import BigNumber from 'bignumber.js';

export const formatUSD = ({
  amount,
  usd,
  digits
}: {
  amount: string | number;
  usd?: string | number;
  digits?: number;
}) => {
  const value = new BigNumber(amount).times(usd ? new BigNumber(usd) : 1);

  return `${value.isGreaterThan(0) ? '≈' : '='} $${value.toFormat(digits)}`;
};
