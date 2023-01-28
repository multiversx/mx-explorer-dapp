import React, { useEffect, useMemo } from 'react';
import { SingleValue } from 'react-select';
import { DropdownChart } from '../../../Home/DropdownChart';
import { DropdownChartOptionType } from '../../../Home/DropdownChart/types';

export type ChartResolutionRangeType = 'year' | 'month' | 'week';

type ChartResolutionItemType = {
  label: string;
  range: ChartResolutionRangeType;
};

export type ChartResolutionType = {
  [key in ChartResolutionRangeType]: {
    label: string;
    range: ChartResolutionRangeType;
  };
};

export const ChartResolution: ChartResolutionType = {
  year: {
    label: '365 days',
    range: 'year'
  },
  month: {
    label: '30 days',
    range: 'month'
  },
  week: {
    label: '7 days',
    range: 'week'
  }
};

type ChartResolutionSelectorProps = {
  value: ChartResolutionRangeType;
  onChange?: (resolution: ChartResolutionItemType) => void;
};

export const ChartResolutionSelector = ({
  value,
  onChange
}: ChartResolutionSelectorProps) => {
  const options: DropdownChartOptionType[] = [
    {
      label: '365 days',
      value: ChartResolution['year'].range
    },
    {
      label: '30 days',
      value: ChartResolution['month'].range
    },
    {
      label: '7 days',
      value: ChartResolution['week'].range
    }
  ];

  const dropdownValue = useMemo(() => {
    return {
      label: ChartResolution[value].label,
      value: ChartResolution[value].range
    };
  }, [value]);

  const onChangeHandler = (option: SingleValue<DropdownChartOptionType>) => {
    const value: ChartResolutionRangeType =
      (option?.value as ChartResolutionRangeType) ??
      ChartResolution['month'].range;

    const activeResolution = ChartResolution[value];

    onChange?.(activeResolution);
  };

  return (
    <DropdownChart
      options={options}
      value={dropdownValue}
      onChange={onChangeHandler}
    />
  );
};
