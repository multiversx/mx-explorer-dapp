import BigNumber from 'bignumber.js';
import { TrendEnum } from 'types';

export const getTrend = (value: number | string): TrendEnum => {
  if (new BigNumber(value).isGreaterThan(0)) {
    return TrendEnum.up;
  }
  if (new BigNumber(value).isLessThan(0)) {
    return TrendEnum.down;
  }

  return TrendEnum.neutral;
};
