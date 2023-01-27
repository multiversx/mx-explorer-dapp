import BigNumber from 'bignumber.js';
import { DIGITS } from 'config';
import { EconomicsType } from 'types/economics.types';

export const processEconomics = (data: EconomicsType) => {
  const totalStakedPercent = new BigNumber(data.staked)
    .dividedBy(new BigNumber(data.circulatingSupply))
    .times(100)
    .toFormat(DIGITS);
  const ecosystemMarketCap = new BigNumber(data.marketCap)
    .plus(new BigNumber(data.tokenMarketCap ? data.tokenMarketCap : 0))
    .toFormat(0);

  return {
    totalSupply: new BigNumber(data.totalSupply).toFormat(0),
    circulatingSupply: new BigNumber(data.circulatingSupply).toFormat(0),
    staked: new BigNumber(data.staked).toFormat(0),
    price: `$${new BigNumber(data.price).toFormat(DIGITS)}`,
    marketCap: `$${new BigNumber(data.marketCap).toFormat(0)}`,
    apr: `${new BigNumber(data.apr).times(100).toFormat(DIGITS)}%`,
    topUpApr: `${new BigNumber(data.topUpApr).times(100).toFormat(DIGITS)}%`,
    baseApr: `${new BigNumber(data.baseApr).times(100).toFormat(DIGITS)}%`,
    tokenMarketCap: `$${new BigNumber(data.tokenMarketCap).toFormat(0)}`,

    totalStakedPercent: `${totalStakedPercent}%`,
    ecosystemMarketCap: `$${ecosystemMarketCap}`
  };
};
