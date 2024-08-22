import BigNumber from 'bignumber.js';
import { ELLIPSIS } from 'appConstants';
import { DIGITS } from 'config';
import { EconomicsType } from 'types/economics.types';

export const processEconomics = (data: EconomicsType) => {
  const totalStakedPercent = new BigNumber(data.staked)
    .dividedBy(new BigNumber(data.circulatingSupply))
    .times(100)
    .toFormat(DIGITS);
  const ecosystemMarketCap = new BigNumber(data.marketCap ?? 0)
    .plus(new BigNumber(data.tokenMarketCap ?? 0))
    .toFormat(0);

  return {
    totalSupply: new BigNumber(data.totalSupply).toFormat(0),
    circulatingSupply: new BigNumber(data.circulatingSupply).toFormat(0),
    staked: new BigNumber(data.staked).toFormat(0),
    price: data.price
      ? `$${new BigNumber(data.price).toFormat(DIGITS)}`
      : ELLIPSIS,
    marketCap: data.marketCap
      ? `$${new BigNumber(data.marketCap).toFormat(0)}`
      : ELLIPSIS,
    apr: `${new BigNumber(data.apr).times(100).toFormat(DIGITS)}%`,
    topUpApr: `${new BigNumber(data.topUpApr).times(100).toFormat(DIGITS)}%`,
    baseApr: `${new BigNumber(data.baseApr).times(100).toFormat(DIGITS)}%`,
    tokenMarketCap: data.tokenMarketCap
      ? `$${new BigNumber(data.tokenMarketCap).toFormat(0)}`
      : ELLIPSIS,

    totalStakedPercent: `${totalStakedPercent}%`,
    ecosystemMarketCap: ecosystemMarketCap ? `$${ecosystemMarketCap}` : ELLIPSIS
  };
};
