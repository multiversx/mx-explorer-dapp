import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { chartResolution } from 'appConstants';
import { generateDays } from 'components/Heatmap/helpers/generators';
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

    const filteredValues = values.filter(
      (day) => nowMs - formatTimestamp(day.timestamp) <= rangeMs
    );
    if (filteredValues.length > 1) {
      return generateDays(filteredValues[0].timestamp, filteredValues);
    }

    return filteredValues;
  }, [values, rangeValue]);

  return {
    range: rangeValue as ChartResolutionRangeType,
    values: processedEntries
  };
};
