import { ChartResolutionType } from 'types';

export const ChartResolution: ChartResolutionType = {
  all: {
    label: 'Max',
    range: 'all'
  },
  year: {
    label: '365d',
    range: 'year'
  },
  month: {
    label: '30d',
    range: 'month'
  },
  week: {
    label: '7d',
    range: 'week'
  },
  day: {
    label: '24h',
    range: 'day'
  }
};
