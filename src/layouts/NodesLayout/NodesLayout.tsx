import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { Loader } from 'components';
import {
  useFetchStake,
  useFetchNodesVersions,
  useFetchShards,
  useFetchNodesIdentities
} from 'hooks';
import {
  activeNetworkSelector,
  shardsSelector,
  nodesVersionsSelector
} from 'redux/selectors';

export const NodesLayout = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const shards = useSelector(shardsSelector);
  const { isFetched: isNodesVersionsFetched } = useSelector(
    nodesVersionsSelector
  );

  const [isDataReady, setIsDataReady] = useState<undefined | boolean>();

  useFetchStake();
  useFetchNodesVersions();
  useFetchShards();
  useFetchNodesIdentities();

  useEffect(() => {
    if (isNodesVersionsFetched && shards.length > 0) {
      setIsDataReady(true);
    }
  }, [activeNetworkId, shards, isNodesVersionsFetched]);

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
