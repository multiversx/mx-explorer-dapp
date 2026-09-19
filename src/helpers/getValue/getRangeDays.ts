import { ChartResolutionRangeType } from 'types';

export const getRangeDays = (range: ChartResolutionRangeType) => {
  switch (range) {
    case 'day':
      return 7;
    case 'week':
      return 7;
    case 'month':
      return 30;
    case 'year':
      return 365;
    // all will return null
    default:
      return 0;
  }
};
