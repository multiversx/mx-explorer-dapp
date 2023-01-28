import BigNumber from 'bignumber.js';
import { GrowthEconomicsType } from 'types';

export const processGrowthEconomics = (data: GrowthEconomicsType) => ({
  developerRewards: `${new BigNumber(data.developerRewards).toFormat(0)}`,
  feesCaptured: `${new BigNumber(data.feesCaptured).toFormat(0)}`,
  applicationsDeployed: `${new BigNumber(data.applicationsDeployed).toFormat(
    0
  )}`
});
