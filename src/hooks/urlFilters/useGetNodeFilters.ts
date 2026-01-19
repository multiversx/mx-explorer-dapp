import { useSearchParams } from 'react-router-dom';

import { cleanUrlFilters, getUrlParam } from 'helpers';
import { NodeFiltersEnum } from 'types';

export const useGetNodeFilters = () => {
  const [searchParams] = useSearchParams();
  const getParam = getUrlParam(searchParams);

  const filters = {
    status: getParam(NodeFiltersEnum.status),
    type: getParam(NodeFiltersEnum.type),
    identity: getParam(NodeFiltersEnum.identity),
    shard: getParam(NodeFiltersEnum.shard, { checkIsInteger: true }),
    issues: getParam(NodeFiltersEnum.issues),
    fullHistory: getParam(NodeFiltersEnum.fullHistory),
    online: getParam(NodeFiltersEnum.online, {
      checkIsBoolean: true
    }),
    isQualified: getParam(NodeFiltersEnum.isQualified, {
      checkIsBoolean: true
    }),
    isAuctioned: getParam(NodeFiltersEnum.isAuctioned, {
      checkIsBoolean: true
    }),
    isAuctionDangerZone: getParam(NodeFiltersEnum.isAuctionDangerZone, {
      checkIsBoolean: true
    })
  };

  return cleanUrlFilters(filters);
};
