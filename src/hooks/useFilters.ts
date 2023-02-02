import { useSearchParams } from 'react-router-dom';
import { stringIsInteger } from 'helpers';

export const useGetFilters = () => {
  const [searchParams] = useSearchParams();
  const {
    online,
    search,
    status,
    type,
    issues,
    fullHistory,
    shard,
    identity,
    page,
    order,
    sort
  } = Object.fromEntries(searchParams);

  const size = page && stringIsInteger(page) ? parseInt(page) : 1;

  const getQueryObject = () => ({
    ...(search ? { search } : {}),
    ...(online ? { online: online === 'true' } : {}),
    ...(status ? { status } : {}),
    ...(type ? { type } : {}),
    ...(identity ? { identity } : {}),
    ...(sort ? { sort } : {}),
    ...(order ? { order } : {}),
    ...(issues ? { issues: 'true' } : {}),
    ...(fullHistory ? { fullHistory: 'true' } : {}),
    ...(shard && stringIsInteger(shard) ? { shard } : {})
  });

  return {
    getQueryObject,
    size
  };
};
