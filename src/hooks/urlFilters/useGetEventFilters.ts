import { useSearchParams } from 'react-router-dom';

import { cleanUrlFilters, getUrlParam } from 'helpers';
import { TransactionFiltersEnum } from 'types';

export const useGetEventFilters = () => {
  const [searchParams] = useSearchParams();
  const getParam = getUrlParam(searchParams);

  const filters = {
    address: getParam('address'),
    identifier: getParam('identifier'),
    txHash: getParam('txHash'),
    shard: getParam('shard', true),
    before: getParam(TransactionFiltersEnum.before, true),
    after: getParam(TransactionFiltersEnum.after, true)
  };

  return cleanUrlFilters(filters);
};
