import { BigNumber } from 'bignumber.js';

export const formatPercentLabel = (percent?: number) => {
  if (!percent) {
    return 'N/A';
  }

  const bnPercent = new BigNumber(percent);
  const percentLabel = `${
    bnPercent.isGreaterThanOrEqualTo(1) ? bnPercent.toFormat(2) : '< 1'
  }%`;

  return percentLabel;
};
