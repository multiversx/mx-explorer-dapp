import { useSearchParams } from 'react-router-dom';

import { SortOrderEnum } from 'types';

export const useGetSort = () => {
  const [searchParams] = useSearchParams();
  const { order, sort } = Object.fromEntries(searchParams);

  return {
    ...(sort ? { sort } : {}),
    ...(order ? { order: order as SortOrderEnum } : {})
  };
};
