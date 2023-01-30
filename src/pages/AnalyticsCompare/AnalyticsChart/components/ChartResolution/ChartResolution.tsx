import React, { useMemo } from 'react';
import classNames from 'classnames';

import { ChartSelectOptionType } from '../../../../Home/ChartSelect/types';

import styles from './styles.module.scss';

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
      label: '7d',
      value: ChartResolution['week'].range
    },
    {
      label: '30d',
      value: ChartResolution['month'].range
    },
    {
      label: '365d',
      value: ChartResolution['year'].range
    },
    {
      label: 'Max',
      value: ChartResolution['all'].range
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

  const onChangeHandler = (option: ChartSelectOptionType) => {
    const value: ChartResolutionRangeType =
      (option?.value as ChartResolutionRangeType) ??
      ChartResolution['month'].range;

    const activeResolution = ChartResolution[value];

    onChange?.(activeResolution);
  };

  return (
    <div className={styles.resolutions}>
      {options.map((option) => (
        <div
          key={option.label}
          onClick={() => onChangeHandler(option)}
          className={classNames(styles.resolution, {
            [styles.active]: option.value === dropdownValue.value
          })}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};
