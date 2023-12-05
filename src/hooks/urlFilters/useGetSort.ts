import { useSearchParams } from 'react-router-dom';

import { SortOrderEnum } from 'types';

export const useGetSort = () => {
  const [searchParams] = useSearchParams();
  const { order, sort } = Object.fromEntries(searchParams);

  return {
    ...(sort ? { sort: sort as SortOrderEnum } : {}),
    ...(order ? { order: order as SortOrderEnum } : {})
  };
};
