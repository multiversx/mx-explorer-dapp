import { useMemo } from 'react';
import classNames from 'classnames';
import { SingleValue } from 'react-select';

import { chartResolution } from 'appConstants';
import { Select, SelectOptionType } from 'components';
import {
  ChartResolutionRangeType,
  ChartResolutionSelectorPropsType,
  WithClassnameType
} from 'types';

import styles from './styles.module.scss';

export const ChartResolutionSelector = ({
  value,
  onChange,
  hasDayOption = false,
  isResponsive = false,
  className
}: ChartResolutionSelectorPropsType & WithClassnameType) => {
  const options: SelectOptionType[] = [
    ...(hasDayOption
      ? [
          {
            label: '24h',
            value: chartResolution['day'].range
          }
        ]
      : []),
    {
      label: '7d',
      value: chartResolution['week'].range
    },
    {
      label: '30d',
      value: chartResolution['month'].range
    },
    {
      label: '365d',
      value: chartResolution['year'].range
    },
    {
      label: 'Max',
      value: chartResolution['all'].range
    }
  ];

  const dropdownValue = useMemo(() => {
    if (!value) {
      return {
        label: chartResolution['month'].label,
        value: chartResolution['month'].range
      };
    }

    return {
      label: chartResolution[value].label,
      value: chartResolution[value].range
    };
  }, [value]);

  const onChangeHandler = (
    option: SingleValue<SelectOptionType> | SelectOptionType
  ) => {
    const value: ChartResolutionRangeType =
      (option?.value as ChartResolutionRangeType) ??
      chartResolution['month'].range;

    const activeResolution = chartResolution[value];

    onChange?.(activeResolution);
  };

  return (
    <div
      className={classNames(styles.select, className, {
        [styles.responsive]: isResponsive
      })}
    >
      <Select
        options={options}
        onChange={onChangeHandler}
        value={dropdownValue}
      />
    </div>
  );
};
