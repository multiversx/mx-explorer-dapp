import * as React from 'react';
import { faArrowDown } from '@fortawesome/pro-regular-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/pro-regular-svg-icons/faArrowUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, Link } from 'react-router-dom';

const Sort = ({ id, field }: { field: React.ReactNode; id: string }) => {
  const { search, pathname } = useLocation();
  const urlParams = new URLSearchParams(search);
  const { order, sort, ...rest } = Object.fromEntries(urlParams);

  const nextOrder = () => {
    if (sort === id) {
      switch (order) {
        case 'asc':
          return 'desc';
        case 'desc':
          return undefined;
      }
    }
    return 'asc';
  };

  const newOrder = nextOrder();

  const nextUrlParams = new URLSearchParams({
    ...rest,
    ...(newOrder ? { sort: id } : {}),
    ...(newOrder ? { order: newOrder } : {}),
  }).toString();

  return (
    <Link to={`${pathname}?${nextUrlParams}`} className="text-body">
      {field}
      {order === 'asc' && sort === id && (
        <FontAwesomeIcon icon={faArrowUp} className="text-primary side-action" />
      )}
      {order === 'desc' && sort === id && (
        <FontAwesomeIcon icon={faArrowDown} className="text-primary side-action" />
      )}
    </Link>
  );
};

export default Sort;
