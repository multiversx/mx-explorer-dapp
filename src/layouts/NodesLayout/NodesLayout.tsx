import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { Loader, PageState } from 'components';
import {
  useFetchStake,
  useFetchNodesVersions,
  useFetchNodesCount,
  useFetchShards
} from 'hooks';
import { faCogs } from 'icons/regular';
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
  useFetchNodesCount();

  useEffect(() => {
    if (!(isNodesVersionsFetched && shards.length > 0)) {
      setIsDataReady(false);
    }
    setIsDataReady(true);
  }, [activeNetworkId, shards, isNodesVersionsFetched]);

  if (isDataReady === undefined) {
    return <Loader />;
  }

  if (!isDataReady) {
    return <PageState icon={faCogs} title='Unable to load data' isError />;
  }

  return (
    <div className='container page-content'>
      <Outlet />
    </div>
  );
};
