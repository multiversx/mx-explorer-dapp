import React from 'react';
import { faSort, faSortDown, faSortUp } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router-dom';

import { SortOrderEnum } from 'types';

export const Sort = ({ id, field }: { field: React.ReactNode; id: string }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { order, sort, ...rest } = Object.fromEntries(searchParams);

  const nextOrder = () => {
    if (sort === id) {
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

  return (
    <div
      className='me-n1 cursor-pointer'
      onClick={() => {
        updateSortValue();
      }}
    >
      {field}
      {sort !== id && (
        <FontAwesomeIcon
          icon={faSort}
          className='side-action text-neutral-400'
        />
      )}
      {order === SortOrderEnum.asc && sort === id && (
        <FontAwesomeIcon icon={faSortUp} className='side-action text-primary' />
      )}
      {order === SortOrderEnum.desc && sort === id && (
        <FontAwesomeIcon
          icon={faSortDown}
          className='side-action text-primary'
        />
      )}
    </div>
  );
};
