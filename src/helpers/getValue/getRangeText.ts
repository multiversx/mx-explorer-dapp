import { ChartResolutionRangeType } from 'types';

export const getRangeText = (range: ChartResolutionRangeType) => {
  switch (range) {
    case 'day':
      return 'last day';
    case 'week':
      return 'last week';
    case 'month':
      return 'last month';
    case 'year':
      return 'last year';
    // all will return null
    default:
      return 'all time';
  }
};
