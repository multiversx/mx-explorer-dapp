import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { faSort, faSortDown, faSortUp } from 'icons/duotone';
import { SortOrderEnum, TableFilterUIType } from 'types';

export interface TableSortUIType extends TableFilterUIType {
  id: string;
  hasNegativeMargin?: boolean;
}

export const SortOrder = ({
  id,
  text,
  hideFilters,
  defaultActive,
  defaultOrder,
  hasNegativeMargin = true,
  className
}: TableSortUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    order: searchOrder,
    sort,
    ...rest
  } = Object.fromEntries(searchParams);

  const order = searchOrder || defaultOrder;
  const isActive = sort === id || (!sort && defaultActive);
  const isValidSortOrder =
    !order || Object.values(SortOrderEnum).includes(order as SortOrderEnum);

  const nextOrder = () => {
    if (isActive) {
      switch (order) {
        case SortOrderEnum.desc:
          return SortOrderEnum.asc;
        case SortOrderEnum.asc:
          return undefined;
      }
    }
    return SortOrderEnum.desc;
  };

  const newOrder = nextOrder();

  const updateSortValue = () => {
    const nextUrlParams = {
      ...rest,
      ...(newOrder ? { sort: id } : {}),
      ...(newOrder ? { order: newOrder } : {})
    };

    setSearchParams(nextUrlParams);
  };

  if (hideFilters) {
    return text;
  }

  return (
    <div
      className={classNames('cursor-pointer', {
        'me-n1': hasNegativeMargin,
        'text-primary-100': isActive,
        className
      })}
      onClick={() => {
        updateSortValue();
      }}
    >
      {((sort !== id && !isActive) || !isValidSortOrder) && (
        <FontAwesomeIcon
          icon={faSort}
          className='side-action text-neutral-400'
        />
      )}
      {isActive && isValidSortOrder && (
        <>
          {order === SortOrderEnum.asc && (
            <FontAwesomeIcon
              icon={faSortUp}
              className='side-action text-primary'
            />
          )}
          {order === SortOrderEnum.desc && (
            <FontAwesomeIcon
              icon={faSortDown}
              className='side-action text-primary'
            />
          )}
        </>
      )}
    </div>
  );
};
