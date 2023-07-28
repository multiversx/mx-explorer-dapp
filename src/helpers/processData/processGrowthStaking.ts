import BigNumber from 'bignumber.js';
import { DIGITS } from 'config';
import { GrowthStakingType } from 'types';

export const processGrowthStaking = (data: GrowthStakingType) => {
  const averageAPRPercent = new BigNumber(data.averageAPR)
    .times(100)
    .toFormat(DIGITS);
  const stakingPercentagePercent = new BigNumber(data.stakingPercentage)
    .times(100)
    .toFormat(DIGITS);

  return {
    totalStaked: new BigNumber(data.totalStaked).toFormat(0),
    stakingPercentage: `${stakingPercentagePercent}%`,
    circulatingSupply: new BigNumber(data.circulatingSupply).toFormat(0),
    usersStaking: new BigNumber(data.usersStaking).toFormat(0),
    averageAPR: `${averageAPRPercent}%`
  };
};
