import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { Loader } from 'components';
import { useFetchStake, useFetchNodesVersions, useFetchShards } from 'hooks';
import {
  activeNetworkSelector,
  shardsSelector,
  stakeSelector,
  nodesVersionsSelector
} from 'redux/selectors';

export const NodesLayout = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const shards = useSelector(shardsSelector);
  const { isFetched: isStakeFetched } = useSelector(stakeSelector);
  const { isFetched: isNodesVersioonsFetched } = useSelector(
    nodesVersionsSelector
  );

  const [isDataReady, setIsDataReady] = useState<undefined | boolean>();

  useFetchStake();
  useFetchNodesVersions();
  useFetchShards();

  useEffect(() => {
    if (isStakeFetched && isNodesVersioonsFetched && shards.length > 0) {
      setIsDataReady(true);
    }
  }, [activeNetworkId, shards, isStakeFetched, isNodesVersioonsFetched]);

  return (
    <>
      {isDataReady === undefined && <Loader />}
      {isDataReady && (
        <div className='container page-content'>
          <Outlet />
        </div>
      )}
    </>
  );
};
