import { useSearchParams } from 'react-router-dom';

import { stringIsInteger } from 'lib';

export const useGetNodeFilters = () => {
  const [searchParams] = useSearchParams();
  const {
    online,
    status,
    type,
    issues,
    fullHistory,
    shard,
    identity,
    isQualified,
    isAuctioned,
    isAuctionDangerZone
  } = Object.fromEntries(searchParams);

  return {
    ...(status ? { status } : {}),
    ...(type ? { type } : {}),
    ...(identity ? { identity } : {}),
    ...(shard && stringIsInteger(shard) ? { shard } : {}),
    ...(online ? { online: online === 'true' } : {}),
    ...(issues ? { issues: 'true' } : {}),
    ...(fullHistory ? { fullHistory: 'true' } : {}),
    ...(isQualified ? { isQualified: isQualified === 'true' } : {}),
    ...(isAuctioned ? { isAuctioned: isAuctioned === 'true' } : {}),
    ...(isAuctionDangerZone
      ? { isAuctionDangerZone: isAuctionDangerZone === 'true' }
      : {})
  };
};
