import { useSearchParams } from 'react-router-dom';

import { cleanUrlFilters, getUrlParam } from 'helpers';
import { BlockFiltersEnum } from 'types';

export const useGetBlockFilters = () => {
  const [searchParams] = useSearchParams();
  const getParam = getUrlParam(searchParams);

  const filters = {
    shard: getParam(BlockFiltersEnum.shard, true)
  };

  return cleanUrlFilters(filters);
};
