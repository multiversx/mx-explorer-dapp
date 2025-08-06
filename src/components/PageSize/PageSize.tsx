import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { SingleValue } from 'react-select';

import { PAGE_SIZE, MAX_RESULTS } from 'appConstants';
import { Select, SelectOptionType } from 'components';
import { formatBigNumber, stringIsInteger } from 'helpers';
import { WithClassnameType } from 'types';

export interface PageSizeUIType extends WithClassnameType {
  maxSize?: number;
  defaultSize?: number;
  sizeArray?: number[];
}

export const PageSize = ({
  defaultSize = PAGE_SIZE,
  maxSize = MAX_RESULTS,
  sizeArray = [PAGE_SIZE, 10, 50, 75, 100],
  className
}: PageSizeUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const { page, size, ...rest } = params;
  const paramSize = stringIsInteger(String(size))
    ? parseInt(size)
    : defaultSize;

  const currentSize = Math.min(paramSize, maxSize);
  const sortedArray = [...new Set([...sizeArray, defaultSize])].sort(
    function (a, b) {
      return a - b;
    }
  );
  const validSizeArray = maxSize
    ? sortedArray.filter((option) => option <= maxSize)
    : sortedArray;

  const options = validSizeArray.map((size) => {
    return { label: formatBigNumber({ value: size }), value: size };
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
        'page-size d-flex align-items-center gap-2',
        { 'ps-md-3': !Boolean(className) },
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
