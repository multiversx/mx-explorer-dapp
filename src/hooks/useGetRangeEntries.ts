import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { chartResolution } from 'appConstants';
import { formatTimestamp, getRangeDays } from 'helpers';
import { ChartDataType, ChartResolutionRangeType } from 'types';

export const useGetRangeEntries = (values: ChartDataType[]) => {
  const [searchParams] = useSearchParams();
  const { range } = Object.fromEntries(searchParams);
  const rangeValue = Object.keys(chartResolution).includes(range)
    ? range
    : 'year';

  const processedEntries = useMemo(() => {
    if (rangeValue === 'all') {
      return values;
    }

    const nowMs = Date.now();
    const rangeMs =
      getRangeDays(rangeValue as ChartResolutionRangeType) *
      24 *
      60 *
      60 *
      1000;

    return values.filter(
      (day) => nowMs - formatTimestamp(day.timestamp) <= rangeMs
    );
  }, [values, rangeValue]);

  return processedEntries;
};
