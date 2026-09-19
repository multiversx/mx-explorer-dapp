import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { chartResolution } from 'appConstants';
import { getRangeEntries } from 'helpers';
import { ChartDataType, ChartResolutionRangeType } from 'types';

export const useGetRangeEntries = (values: ChartDataType[]) => {
  const [searchParams] = useSearchParams();
  const { range } = Object.fromEntries(searchParams);
  const rangeValue = (
    Object.keys(chartResolution).includes(range) ? range : 'year'
  ) as ChartResolutionRangeType;

  const processedEntries = useMemo(
    () => getRangeEntries({ entries: values, range: rangeValue }),
    [values, rangeValue]
  );

  return {
    range: rangeValue,
    values: processedEntries
  };
};
