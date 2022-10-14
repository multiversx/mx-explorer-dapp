import BigNumber from 'bignumber.js';

export const initialEconomics = {
  economicsFetched: false,
  totalSupply: '...',
  circulatingSupply: '...',
  staked: '...',
  price: '...',
  marketCap: '...',
  apr: '...',
  topUpApr: '...',
  baseApr: '...',
  tokenMarketCap: '...',
  totalStakedPercent: '...',
  ecosystemMarketCap: '...',
};

export default function processEconomics(statsData: any) {
  const { data, success } = statsData;
  const totalStakedPercent = new BigNumber(data.staked)
    .dividedBy(new BigNumber(data.circulatingSupply))
    .times(100)
    .toFixed(0);
  const ecosystemMarketCap = new BigNumber(data.marketCap)
    .plus(new BigNumber(data.tokenMarketCap ? data.tokenMarketCap : 0))
    .toFormat(0);

  const newEconomics = success
    ? {
        economicsFetched: true,
        totalSupply: new BigNumber(data.totalSupply).toFormat(),
        circulatingSupply: new BigNumber(data.circulatingSupply).toFormat(),
        staked: new BigNumber(data.staked).toFormat(),
        price: data.price,
        marketCap: data.marketCap,
        apr: data.apr,
        topUpApr: data.topUpApr,
        baseApr: data.baseApr,
        tokenMarketCap: `$${new BigNumber(data.tokenMarketCap).toFormat(0)}`,
        totalStakedPercent: `${totalStakedPercent}%`,
        ecosystemMarketCap: `$${ecosystemMarketCap}`,
      }
    : initialEconomics;

  return newEconomics;
}
