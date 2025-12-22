import { useSearchParams } from 'react-router-dom';

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
}

export const Range = ({ defaultRange = 'year', className }: RangeUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const { range, ...rest } = params;

  const defaultValue = Object.keys(chartResolution).includes(range)
    ? range
    : defaultRange;

  const onChangeHandler = (resolution: ChartResolutionItemType) => {
    if (!resolution.range) {
      return;
    }

    const nextUrlParams = {
      ...rest,
      range: String(resolution.range)
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
