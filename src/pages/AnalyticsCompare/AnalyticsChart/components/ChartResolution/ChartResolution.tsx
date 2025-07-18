import { Fragment, useMemo } from 'react';
import classNames from 'classnames';
import { SingleValue } from 'react-select';

import { Select, SelectOptionType } from 'components';

import styles from './styles.module.scss';
import {
  ChartResolutionRangeType,
  ChartResolutionSelectorPropsType,
  ChartResolutionType
} from './types';

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

export const ChartResolutionSelector = ({
  value,
  onChange,
  hasDayOption = false,
  isResponsive = false
}: ChartResolutionSelectorPropsType) => {
  const options: SelectOptionType[] = [
    ...(hasDayOption
      ? [
          {
            label: '24h',
            value: ChartResolution['day'].range
          }
        ]
      : []),
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

  const onChangeHandler = (
    option: SingleValue<SelectOptionType> | SelectOptionType
  ) => {
    const value: ChartResolutionRangeType =
      (option?.value as ChartResolutionRangeType) ??
      ChartResolution['month'].range;

    const activeResolution = ChartResolution[value];

    onChange?.(activeResolution);
  };

  return (
    <Fragment>
      <div
        className={classNames(styles.select, {
          [styles.responsive]: isResponsive
        })}
      >
        <Select
          options={options}
          onChange={onChangeHandler}
          value={dropdownValue}
        />
      </div>

      <div
        className={classNames(styles.resolutions, {
          [styles.responsive]: isResponsive
        })}
      >
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
    </Fragment>
  );
};
