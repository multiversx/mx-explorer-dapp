import React from 'react';
import ShardsList from './ShardsList';
import { adapter, Loader } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import GlobalStakeCard from './GlobalStakeCard';
import { NodesVersionsType } from 'context/state';

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

const NodesLayout = ({ children }: { children: React.ReactNode }) => {
  const { getShards, getGlobalStake, getEconomics, getNodesVersions } = adapter();
  const dispatch = useGlobalDispatch();
  const { activeNetworkId } = useGlobalState();

  const [dataReadyForNetwork, setDataReadyForNetwork] = React.useState<
    string | undefined | boolean
  >();

  const fetchShardsAndGlobalStaking = () => {
    if (dataReadyForNetwork !== activeNetworkId) {
      Promise.all([getShards(), getGlobalStake(), getEconomics(), getNodesVersions()]).then(
        ([shards, globalStake, economics, nodesVersions]) => {
          const newGlobalStake = {
            ...(globalStake.success
              ? {
                  ...globalStake.data,
                }
              : {}),
          };

          const newEconomics = {
            ...(economics.success
              ? {
                  ...economics.data,
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

          dispatch({
            type: 'setGlobalStake',
            globalStake: globalStake.success
              ? {
                  ...newGlobalStake,
                  ...newEconomics,
                  ...newNodesVersions,
                }
              : undefined,
          });

          if (shards.success) {
            dispatch({
              type: 'setShards',
              shards: shards.data,
            });
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

export default NodesLayout;
