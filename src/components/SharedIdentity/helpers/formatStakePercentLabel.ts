import { BigNumber } from 'bignumber.js';

export const formatStakePercentLabel = (stakePercent?: number) => {
  if (!stakePercent) {
    return 'N/A';
  }

  const bnStakePercent = new BigNumber(stakePercent);
  const stakePercentLabel = `${
    bnStakePercent.isGreaterThanOrEqualTo(1)
      ? bnStakePercent.toFormat(2)
      : '< 1'
  }%`;

  return stakePercentLabel;
};
