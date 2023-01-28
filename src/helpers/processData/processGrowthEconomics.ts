import BigNumber from 'bignumber.js';
import { GrowthEconomicsType } from 'types';

export const processGrowthEconomics = (data: GrowthEconomicsType) => ({
  developerRewards: `${new BigNumber(data.developerRewards).toFormat(0)} EGLD`,
  feesCaptured: `${new BigNumber(data.feesCaptured).toFormat(0)} EGLD`,
  applicationsDeployed: `${new BigNumber(data.applicationsDeployed).toFormat(
    0
  )}`
});
