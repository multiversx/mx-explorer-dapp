import * as React from 'react';
import { faSort } from '@fortawesome/pro-duotone-svg-icons/faSort';
import { faSortDown } from '@fortawesome/pro-duotone-svg-icons/faSortDown';
import { faSortUp } from '@fortawesome/pro-duotone-svg-icons/faSortUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, Link } from 'react-router-dom';
import { SortOrderEnum } from 'helpers/types';

const Sort = ({ id, field }: { field: React.ReactNode; id: string }) => {
  const { search, pathname } = useLocation();
  const urlParams = new URLSearchParams(search);
  const { order, sort, ...rest } = Object.fromEntries(urlParams);

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

  const nextUrlParams = new URLSearchParams({
    ...rest,
    ...(newOrder ? { sort: id } : {}),
    ...(newOrder ? { order: newOrder } : {}),
  }).toString();

  return (
    <Link to={`${pathname}?${nextUrlParams}`} className="text-body mr-n1">
      {field}
      {sort !== id && <FontAwesomeIcon icon={faSort} className="side-action text-secondary" />}
      {order === SortOrderEnum.asc && sort === id && (
        <FontAwesomeIcon icon={faSortUp} className="side-action text-body" />
      )}
      {order === SortOrderEnum.desc && sort === id && (
        <FontAwesomeIcon icon={faSortDown} className="side-action text-body" />
      )}
    </Link>
  );
};

export default Sort;
