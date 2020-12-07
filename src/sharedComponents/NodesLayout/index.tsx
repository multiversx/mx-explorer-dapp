import React from 'react';
import ShardsList from './ShardsList';
import { adapter, Loader } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';

const NodesLayout = ({ children }: { children: React.ReactNode }) => {
  const { getShards, getGlobalStake } = adapter();
  const dispatch = useGlobalDispatch();
  const { activeNetworkId } = useGlobalState();

  const [dataReadyForNetwork, setDataReadyForNetwork] = React.useState<
    string | undefined | false
  >();

  const fetchShardsAndGlobalStaking = () => {
    if (dataReadyForNetwork !== activeNetworkId) {
      Promise.all([getShards(), getGlobalStake()]).then(([shards, globalStake]) => {
        if (globalStake.success) {
          dispatch({
            type: 'setGlobalStake',
            globalStake: globalStake.data,
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
      });
    }
  };

  React.useEffect(fetchShardsAndGlobalStaking, [activeNetworkId]);

  return (
    <>
      {dataReadyForNetwork === undefined && <Loader />}
      {dataReadyForNetwork !== undefined && (
        <div className="container pt-spacer">
          <div className="row page-header ">
            <div className="col-12">
              <h3 className="page-title mb-4">
                <span data-testid="title">Nodes</span>
              </h3>
            </div>
          </div>
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
