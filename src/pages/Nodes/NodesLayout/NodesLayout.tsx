import React from 'react';
import { useSelector } from 'react-redux';

import { Loader } from 'components';
import {
  useFetchGlobalStake,
  useFetchNodesVersions,
  useFetchShards
} from 'hooks';
import {
  activeNetworkSelector,
  shardsSelector,
  globalStakeSelector,
  nodesVersionsSelector
} from 'redux/selectors';

export const NodesLayout = ({ children }: { children: React.ReactNode }) => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const shards = useSelector(shardsSelector);
  const { isFetched: isGlobalStakeFetched } = useSelector(globalStakeSelector);
  const { isFetched: isNodesVersioonsFetched } = useSelector(
    nodesVersionsSelector
  );

  const [isDataReady, setIsDataReady] = React.useState<undefined | boolean>();

  useFetchGlobalStake();
  useFetchNodesVersions();
  useFetchShards();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (isGlobalStakeFetched && isNodesVersioonsFetched && shards.length > 0) {
      setIsDataReady(true);
    }
  }, [activeNetworkId, shards, isGlobalStakeFetched, isNodesVersioonsFetched]);

  return (
    <>
      {isDataReady === undefined && <Loader />}
      {isDataReady && (
        <div className='container page-content'>
          <div className='row'>
            <div className='col-12'>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
