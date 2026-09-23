import BigNumber from 'bignumber.js';
import { ELLIPSIS } from 'appConstants';
import { DIGITS } from 'config';
import { GrowthStakingType } from 'types';

export const processGrowthStaking = (data: GrowthStakingType) => {
  const averageAPRPercent = new BigNumber(data.averageAPR)
    .times(100)
    .toFormat(DIGITS);
  const stakingPercentagePercent = new BigNumber(data.stakingPercentage).times(
    100
  );
  return {
    totalStaked: new BigNumber(data.totalStaked).toFormat(0),
    stakingPercentage: stakingPercentagePercent.isNaN()
      ? ELLIPSIS
      : `${stakingPercentagePercent.toFormat(DIGITS)}%`,
    circulatingSupply: new BigNumber(data.circulatingSupply).toFormat(0),
    usersStaking: new BigNumber(data.usersStaking).toFormat(0),
    averageAPR: `${averageAPRPercent}%`
  };
};
