import { useSearchParams } from 'react-router-dom';

import { stringIsInteger } from 'lib';

export const useGetEventFilters = () => {
  const [searchParams] = useSearchParams();
  const { address, identifier, txHash, shard, before, after } =
    Object.fromEntries(searchParams);

  return {
    ...(address ? { address } : {}),
    ...(identifier ? { identifier } : {}),
    ...(txHash ? { txHash } : {}),
    ...(shard && stringIsInteger(shard) ? { shard: Number(shard) } : {}),
    ...(before && stringIsInteger(before) ? { before: Number(before) } : {}),
    ...(after && stringIsInteger(after) ? { after: Number(after) } : {})
  };
};
