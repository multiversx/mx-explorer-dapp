import React from 'react';
import ShardsList from './ShardsList';
import { adapter, Loader } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import GlobalStakeCard from './GlobalStakeCard';

const NodesLayout = ({ children }: { children: React.ReactNode }) => {
  const { getShards, getGlobalStake, getGlobalStakeNodes } = adapter();
  const dispatch = useGlobalDispatch();
  const { activeNetworkId } = useGlobalState();

  const [dataReadyForNetwork, setDataReadyForNetwork] = React.useState<
    string | undefined | false
  >();

  const fetchShardsAndGlobalStaking = () => {
    if (dataReadyForNetwork !== activeNetworkId) {
      Promise.all([getShards(), getGlobalStake(), getGlobalStakeNodes()]).then(
        ([shards, globalStake, globalStakeNodes]) => {
          if (globalStake.success) {
            dispatch({
              type: 'setGlobalStake',
              globalStake: {
                ...globalStake.data,
                ...{
                  apr: 29,
                  waitingList: 21,
                },
                ...(globalStakeNodes.success
                  ? globalStakeNodes.data
                  : {
                      nodesVerions: [
                        { name: 'v.10', percent: 70 },
                        { name: 'v.0.09', percent: 20 },
                        { name: 'other', percent: 10 },
                      ],
                    }),
              },
            });
          } else {
            dispatch({
              type: 'setGlobalStake',
              globalStake: undefined,
            });
          }

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
          <ShardsList shardsFetched={dataReadyForNetwork === activeNetworkId} />
          <GlobalStakeCard stakeFetched={dataReadyForNetwork === activeNetworkId} />

          <div className="row">
            <div className="col-12">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default NodesLayout;
