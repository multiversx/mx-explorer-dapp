import BigNumber from 'bignumber.js';

export const getPercentage = ({
  amountOutOfTotal,
  total,
  minDelegation
}: {
  amountOutOfTotal: string;
  total: string;
  minDelegation: string;
}): string => {
  const bNamountOutOfTotal = new BigNumber(amountOutOfTotal);
  const bNtotal = new BigNumber(total);
  const bNminDelegation = new BigNumber(minDelegation);
  const percentage = bNamountOutOfTotal.multipliedBy(100).dividedBy(bNtotal);
  const isOverMinimum = bNtotal
    .minus(bNamountOutOfTotal)
    .isGreaterThanOrEqualTo(bNminDelegation);
  const displayPercentage = percentage.isFinite()
    ? percentage.toFixed(4).slice(0, -3)
    : '0';

  return isOverMinimum || !percentage.isFinite() ? displayPercentage : '100';
};
