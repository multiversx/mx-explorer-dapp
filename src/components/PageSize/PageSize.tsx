import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { SingleValue } from 'react-select';

import { PAGE_SIZE, MAX_RESULTS } from 'appConstants';
import { Select, SelectOptionType } from 'components';
import { stringIsInteger } from 'helpers';
import { WithClassnameType } from 'types';

export interface PageSizeUIType extends WithClassnameType {
  maxSize?: number;
}

export const PageSize = ({
  maxSize = MAX_RESULTS,
  className
}: PageSizeUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const { page, size, ...rest } = params;
  const paramSize = stringIsInteger(String(size)) ? parseInt(size) : PAGE_SIZE;

  const currentSize = Math.min(paramSize, maxSize);
  const sizeArray = [
    ...new Set([PAGE_SIZE, 10, 50, 75, 100, currentSize])
  ].sort();
  const validSizeArray = maxSize
    ? sizeArray.filter((option) => option <= maxSize)
    : sizeArray;

  const options = validSizeArray.map((size) => {
    return { label: size, value: size };
  });

  const onChangeHandler = (
    option: SingleValue<SelectOptionType> | SelectOptionType
  ) => {
    if (!option?.value) {
      return;
    }

    const nextUrlParams = {
      ...rest,
      size: String(option.value)
    };
    setSearchParams(nextUrlParams);
  };

  return (
    <div
      className={classNames(
        'page-size d-flex align-items-center gap-2 ps-md-3',
        className
      )}
    >
      Show{' '}
      <Select
        options={options}
        onChange={onChangeHandler}
        defaultValue={{ label: currentSize, value: currentSize }}
      />{' '}
      records
    </div>
  );
};
