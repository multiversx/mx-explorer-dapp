import React from 'react';

import { useAdapter, Loader } from 'components';
import { NodesVersionsType } from 'types';
import { GlobalStakeCard } from './GlobalStakeCard';
import { ShardsList } from './ShardsList';

import { useSelector, useDispatch } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';
import { setShards, setGlobalStake } from 'redux/slices';

const prepareNodesVersions = (data: any) => {
  const versions: NodesVersionsType[] = [];

  Object.keys(data).forEach((version) => {
    const percent = data[version];

    if (percent > 0) {
      versions.push({
        name: version,
        percent: Math.floor(percent * 100),
      });
    }
  });

  return versions.sort((a, b) => b.percent - a.percent);
};

export const NodesLayout = ({ children }: { children: React.ReactNode }) => {
  const { getShards, getGlobalStake, getNodesVersions } = useAdapter();
  const dispatch = useDispatch();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const [dataReadyForNetwork, setDataReadyForNetwork] = React.useState<
    string | undefined | boolean
  >();

  const fetchShardsAndGlobalStaking = () => {
    if (dataReadyForNetwork !== activeNetworkId) {
      Promise.all([getShards(), getGlobalStake(), getNodesVersions()]).then(
        ([shards, globalStake, nodesVersions]) => {
          const newGlobalStake = {
            ...(globalStake.success
              ? {
                  ...globalStake.data,
                }
              : {}),
          };

          const newNodesVersions = {
            ...(nodesVersions.success
              ? {
                  nodesVerions: prepareNodesVersions(nodesVersions.data),
                }
              : {}),
          };

          if (globalStake.success && globalStake?.data) {
            dispatch(setGlobalStake({ ...newGlobalStake, ...newNodesVersions }));
          }

          if (shards.success && shards?.data) {
            dispatch(setShards(shards.data));
            setDataReadyForNetwork(activeNetworkId);
          } else {
            setDataReadyForNetwork(false);
          }
        }
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchShardsAndGlobalStaking, [activeNetworkId]);

  return (
    <>
      {dataReadyForNetwork === undefined && <Loader />}
      {dataReadyForNetwork !== undefined && (
        <div className="container page-content">
          <GlobalStakeCard stakeFetched={dataReadyForNetwork === activeNetworkId} />
          <ShardsList shardsFetched={dataReadyForNetwork === activeNetworkId} />

          <div className="row">
            <div className="col-12">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
