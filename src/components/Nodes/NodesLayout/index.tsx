import React from 'react';
import ShardsList from './ShardsList';
import { adapter, Loader } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import GlobalStakeCard from './GlobalStakeCard';

const NodesLayout = ({ children }: { children: React.ReactNode }) => {
  const { getShards, getGlobalStake, getEconomics, getGlobalStakeNodes } = adapter();
  const dispatch = useGlobalDispatch();
  const { activeNetworkId } = useGlobalState();

  const [dataReadyForNetwork, setDataReadyForNetwork] = React.useState<
    string | undefined | boolean
  >();

  const fetchShardsAndGlobalStaking = () => {
    if (dataReadyForNetwork !== activeNetworkId) {
      Promise.all([getShards(), getGlobalStake(), getEconomics(), getGlobalStakeNodes()]).then(
        ([shards, globalStake, economics, globalStakeNodes]) => {
          const newGlobalStake = {
            ...(globalStake.success
              ? {
                  ...globalStake.data,
                  ...{
                    deliquentStake: 0.3,
                    apr: 29,
                    waitingList: 21,
                  },
                }
              : {}),
          };

          const newEconomics = {
            ...(economics.success ? { ...economics.data } : {}),
          };

          const newGlobalStakeNodes = {
            ...(globalStakeNodes.success
              ? { ...globalStakeNodes.data }
              : {
                  nodesVerions: [
                    { name: 'v.10', percent: 70 },
                    { name: 'v.0.09', percent: 20 },
                    { name: 'other', percent: 10 },
                  ],
                }),
          };

          dispatch({
            type: 'setGlobalStake',
            globalStake: globalStake.success
              ? { ...newGlobalStake, ...newEconomics, ...newGlobalStakeNodes }
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
