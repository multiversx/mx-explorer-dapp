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
    shard: getParam('shard', { checkIsInteger: true }),
    before: getParam(TransactionFiltersEnum.before, { checkIsInteger: true }),
    after: getParam(TransactionFiltersEnum.after, { checkIsInteger: true })
  };

  return cleanUrlFilters(filters);
};
