import BigNumber from 'bignumber.js';
import { DIGITS } from 'config';
import { getTrend } from 'helpers/getValue';
import { GrowthPriceType } from 'types';

export const processGrowthPrice = (data: GrowthPriceType) => {
  const priceChangePercent = new BigNumber(data.priceChange24h)
    .times(100)
    .toFormat(DIGITS);

  return {
    currentPrice: `$${new BigNumber(data.currentPrice).toFormat(DIGITS)}`,
    priceChange24h: `${new BigNumber(priceChangePercent).toFormat(DIGITS)}%`,
    marketCap: `$${new BigNumber(data.marketCap).toFormat(0)}`,
    volume24h: `$${new BigNumber(data.volume24h).toFormat(0)}`,
    priceChangeTrend: getTrend(priceChangePercent)
  };
};
