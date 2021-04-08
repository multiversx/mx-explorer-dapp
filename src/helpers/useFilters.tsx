import { useLocation } from 'react-router-dom';
import { stringIsInteger } from 'helpers';

export default function useGetFilters() {
  const { search: urlSearch } = useLocation();
  const urlParams = new URLSearchParams(urlSearch);
  const {
    online,
    search,
    status,
    type,
    issues,
    shard,
    identity,
    page,
    order,
    sort,
  } = Object.fromEntries(urlParams);

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
    ...(shard && stringIsInteger(shard) ? { shard } : {}),
  });

  return {
    getQueryObject,
    size,
  };
}
