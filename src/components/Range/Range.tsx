import { useSearchParams } from 'react-router';

import { chartResolution } from 'appConstants';
import { ChartResolutionSelector } from 'pages/AnalyticsCompare/AnalyticsChart/components/ChartResolution';
import {
  ChartResolutionItemType,
  ChartResolutionRangeType,
  WithClassnameType
} from 'types';

export interface RangeUIType extends WithClassnameType {
  maxSize?: number;
  defaultRange?: ChartResolutionRangeType;
  prefix?: string;
  clearParams?: boolean;
}

export const Range = ({
  defaultRange = 'year',
  prefix = '',
  clearParams,
  className
}: RangeUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const dynamicParam = `${prefix}${prefix ? 'Range' : 'range'}`;
  const { [dynamicParam]: range, ...rest } = params;

  const defaultValue = Object.keys(chartResolution).includes(range)
    ? range
    : defaultRange;

  const onChangeHandler = (resolution: ChartResolutionItemType) => {
    if (!resolution.range) {
      return;
    }

    const nextUrlParams = {
      ...(clearParams ? {} : { ...rest }),
      [dynamicParam]: String(resolution.range)
    };
    setSearchParams(nextUrlParams);
  };

  return (
    <ChartResolutionSelector
      isResponsive={true}
      hasDayOption={false}
      value={defaultValue as ChartResolutionRangeType}
      onChange={(resolution) => {
        onChangeHandler(resolution);
      }}
      className={className}
    />
  );
};
