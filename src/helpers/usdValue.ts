import BigNumber from 'bignumber.js';

const usdValue = ({
  amount,
  usd,
  showPrefix,
  decimals,
}: {
  amount: string;
  usd?: number;
  showPrefix?: boolean;
  decimals?: number;
}) => {
  if (!usd) {
    return '...';
  }

  const value = new BigNumber(amount).times(usd);
  return `${showPrefix ? (value.isEqualTo(0) ? '= ' : '≈ ') : ''}$${value.toFormat(decimals ?? 2)}`;
};

export default usdValue;
