import { useMemo } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'react-router';
import { SingleValue } from 'react-select';

import { Select, SelectOptionType } from 'components/Select';
import { useGetYearParams } from 'hooks';
import { WithClassnameType } from 'types';

export interface YearUIType extends WithClassnameType {
  years?: number[];
  defaultYear?: number;
  prefix?: string;
  clearParams?: boolean;
}

export const Year = ({
  years = [],
  defaultYear = new Date().getFullYear(),
  prefix = '',
  clearParams,
  className
}: YearUIType) => {
  const [_searchParams, setSearchParams] = useSearchParams();
  const dynamicBeforeParam = `${prefix}${prefix ? 'Before' : 'before'}`;
  const dynamicAfterParam = `${prefix}${prefix ? 'After' : 'after'}`;

  const { before, after, ...rest } = useGetYearParams({ prefix });
  const selectedYear = before
    ? new Date(Number(before)).getUTCFullYear()
    : defaultYear;

  const dropdownYears = useMemo(() => {
    return years.map((value) => {
      return { label: value, value: value };
    });
  }, [years]);

  const onChangeHandler = (option: SingleValue<SelectOptionType>) => {
    if (!option?.value) {
      return;
    }

    const start = new Date(Date.UTC(Number(option.value), 0, 1)).valueOf();
    const end = new Date(Date.UTC(Number(option.value), 12, 0)).valueOf();

    const nextUrlParams = {
      ...(clearParams ? {} : { ...rest }),
      [dynamicAfterParam]: String(start),
      [dynamicBeforeParam]: String(end)
    };
    setSearchParams(nextUrlParams);
  };

  if (years.length === 0 || (years.length === 1 && years[0] === defaultYear)) {
    return null;
  }

  const value =
    dropdownYears.find((option) => option.value === selectedYear) ??
    dropdownYears[dropdownYears.length - 1];

  return (
    <div className={classNames(className)}>
      <Select
        options={dropdownYears}
        onChange={onChangeHandler}
        value={value}
      />
    </div>
  );
};
