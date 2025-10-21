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
    shard: getParam(NodeFiltersEnum.shard, true),
    online: getParam(NodeFiltersEnum.online),
    issues: getParam(NodeFiltersEnum.issues),
    fullHistory: getParam(NodeFiltersEnum.fullHistory),
    isQualified: getParam(NodeFiltersEnum.isQualified),
    isAuctioned: getParam(NodeFiltersEnum.isAuctioned),
    isAuctionDangerZone: getParam(NodeFiltersEnum.isAuctionDangerZone)
  };

  return cleanUrlFilters(filters);
};
