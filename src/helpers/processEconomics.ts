import BigNumber from 'bignumber.js';

export const initialEconomics = {
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
};

export default function processEconomics(statsData: any) {
  const { data, success } = statsData;
  const totalStakedPercent = new BigNumber(data.staked)
    .dividedBy(new BigNumber(data.circulatingSupply))
    .times(100)
    .toFixed(0);

  const newEconomics = success
    ? {
        totalSupply: new BigNumber(data.totalSupply).toFormat(),
        circulatingSupply: new BigNumber(data.circulatingSupply).toFormat(),
        staked: new BigNumber(data.staked).toFormat(),
        price: `$${new BigNumber(data.price).toFormat(2)}`,
        marketCap: `$${new BigNumber(data.marketCap).toFormat()}`,
        apr: `${new BigNumber(data.apr).times(100).toFormat(2)}%`,
        topUpApr: `${new BigNumber(data.topUpApr).times(100).toFormat(2)}%`,
        baseApr: `${new BigNumber(data.baseApr).times(100).toFormat(2)}%`,
        tokenMarketCap: `${new BigNumber(data.tokenMarketCap).toFormat()}`,
        totalStakedPercent: `${totalStakedPercent}%`,
      }
    : initialEconomics;

  return newEconomics;
}
