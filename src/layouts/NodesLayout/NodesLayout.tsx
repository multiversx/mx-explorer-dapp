import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

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

export const NodesLayout = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const shards = useSelector(shardsSelector);
  const { isFetched: isGlobalStakeFetched } = useSelector(globalStakeSelector);
  const { isFetched: isNodesVersioonsFetched } = useSelector(
    nodesVersionsSelector
  );

  const [isDataReady, setIsDataReady] = useState<undefined | boolean>();

  useFetchGlobalStake();
  useFetchNodesVersions();
  useFetchShards();

  useEffect(() => {
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
            <div className='col-12'>
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
