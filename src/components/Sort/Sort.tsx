import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { faSort, faSortDown, faSortUp } from 'icons/duotone';
import { SortOrderEnum } from 'types';

export const Sort = ({ id, text }: { text: React.ReactNode; id: string }) => {
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
      className={classNames('me-n1 cursor-pointer', {
        'text-primary-100': sort === id
      })}
      onClick={() => {
        updateSortValue();
      }}
    >
      {text}
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
