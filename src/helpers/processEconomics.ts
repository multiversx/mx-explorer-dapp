import BigNumber from 'bignumber.js';
import { EconomicsType } from 'types/economics.types';

export const processEconomics = (data: EconomicsType) => {
  const totalStakedPercent = new BigNumber(data.staked)
    .dividedBy(new BigNumber(data.circulatingSupply))
    .times(100)
    .toNumber();
  const ecosystemMarketCap = new BigNumber(data.marketCap)
    .plus(new BigNumber(data.tokenMarketCap ? data.tokenMarketCap : 0))
    .toNumber();

  return {
    ...data,
    economicsFetched: true,
    totalStakedPercent,
    ecosystemMarketCap,
  };
};
