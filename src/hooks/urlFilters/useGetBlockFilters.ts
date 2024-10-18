import { useSearchParams } from 'react-router-dom';

import { getUrlParam } from 'helpers';
import { BlockFiltersEnum } from 'types';

export const useGetBlockFilters = () => {
  const [searchParams] = useSearchParams();
  const getParam = getUrlParam(searchParams);

  return {
    shard: getParam(BlockFiltersEnum.shard)
  };
};
