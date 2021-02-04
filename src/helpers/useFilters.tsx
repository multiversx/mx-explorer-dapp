import { useLocation } from 'react-router-dom';
import { stringIsInteger } from 'helpers';

export default function useGetFilters() {
  const { search: urlSearch } = useLocation();
  const urlParams = new URLSearchParams(urlSearch);
  const {
    status,
    search,
    peerType,
    nodeType,
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
    ...(status ? { status } : {}),
    ...(peerType ? { peerType } : {}),
    ...(nodeType ? { nodeType } : {}),
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
