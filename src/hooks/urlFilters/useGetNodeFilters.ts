import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { useSearchParams } from 'react-router-dom';

export const useGetNodeFilters = () => {
  const [searchParams] = useSearchParams();
  const { online, status, type, issues, fullHistory, shard, identity } =
    Object.fromEntries(searchParams);

  return {
    ...(online ? { online: online === 'true' } : {}),
    ...(status ? { status } : {}),
    ...(type ? { type } : {}),
    ...(identity ? { identity } : {}),
    ...(issues ? { issues: 'true' } : {}),
    ...(fullHistory ? { fullHistory: 'true' } : {}),
    ...(shard && stringIsInteger(shard) ? { shard } : {})
  };
};
