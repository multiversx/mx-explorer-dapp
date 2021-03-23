import React from 'react';
import ShardsList from './ShardsList';
import { adapter, Loader } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import GlobalStakeCard from './GlobalStakeCard';

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
            ...(economics.success ? { ...economics.data } : {}),
          };

          const newNodesVersions = {
            ...(nodesVersions.success ? { ...nodesVersions.data } : {}),
          };

          dispatch({
            type: 'setGlobalStake',
            globalStake: globalStake.success
              ? { ...newGlobalStake, ...newEconomics, ...newNodesVersions }
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

  React.useEffect(fetchShardsAndGlobalStaking, [activeNetworkId]);

  return (
    <>
      {dataReadyForNetwork === undefined && <Loader />}
      {dataReadyForNetwork !== undefined && (
        <div className="container pt-spacer">
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
