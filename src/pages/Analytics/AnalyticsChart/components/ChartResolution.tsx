import React, { useEffect, useMemo } from 'react';
import { SingleValue } from 'react-select';
import { ChartSelect } from '../../../Home/ChartSelect';
import { ChartSelectOptionType } from '../../../Home/ChartSelect/types';

export type ChartResolutionRangeType = 'all' | 'year' | 'month' | 'week';

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
  all: {
    label: 'All',
    range: 'all'
  },
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
  const options: ChartSelectOptionType[] = [
    {
      label: 'All',
      value: ChartResolution['all'].range
    },
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
    if (!value) {
      return {
        label: ChartResolution['month'].label,
        value: ChartResolution['month'].range
      };
    }

    return {
      label: ChartResolution[value].label,
      value: ChartResolution[value].range
    };
  }, [value]);

  const onChangeHandler = (option: SingleValue<ChartSelectOptionType>) => {
    const value: ChartResolutionRangeType =
      (option?.value as ChartResolutionRangeType) ??
      ChartResolution['month'].range;

    const activeResolution = ChartResolution[value];

    onChange?.(activeResolution);
  };

  return (
    <ChartSelect
      options={options}
      value={dropdownValue}
      onChange={onChangeHandler}
    />
  );
};
