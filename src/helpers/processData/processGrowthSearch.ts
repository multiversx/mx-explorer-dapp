import BigNumber from 'bignumber.js';
import { DIGITS } from 'config';
import { getTrend } from 'helpers/getValue';
import { GrowthSearchType } from 'types';

export const processGrowthSearch = (data: GrowthSearchType) => {
  const priceChangePercent = new BigNumber(data.priceChange24h)
    .times(100)
    .toFormat(DIGITS);

  return {
    currentPrice: `$${new BigNumber(data.currentPrice).toFormat(DIGITS)}`,
    priceChange24h: `${new BigNumber(priceChangePercent).toFormat(DIGITS)}%`,
    activeAccountsToday: `${new BigNumber(data.activeAccountsToday).toFormat(
      0
    )}`,
    priceChangeTrend: getTrend(priceChangePercent)
  };
};
