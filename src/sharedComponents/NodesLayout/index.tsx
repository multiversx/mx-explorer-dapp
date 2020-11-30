import React from 'react';
import ShardsList from './ShardsList';
import { adapter, Loader } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';

const NodesLayout = ({ children }: { children: React.ReactNode }) => {
  const { getShards, getGlobalStake } = adapter();
  const dispatch = useGlobalDispatch();
  const { shards } = useGlobalState();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>(
    shards.length === 0 ? undefined : true
  );

  const fetchShardsAndGlobalStaking = () => {
    if (dataReady === undefined) {
      Promise.all([getShards(), getGlobalStake()]).then(([shards, globalStake]) => {
        if (shards.success) {
          dispatch({
            type: 'setShards',
            shards: shards.data,
          });
        }

        if (globalStake.success) {
          dispatch({
            type: 'setGlobalStake',
            globalStake: globalStake.data,
          });
        }

        setDataReady(shards.success);
      });
    }
  };

  React.useEffect(fetchShardsAndGlobalStaking, []);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady !== undefined && (
        <div className="container pt-spacer">
          <div className="row page-header ">
            <div className="col-12">
              <h3 className="page-title mb-4">
                <span data-testid="title">Nodes</span>
              </h3>
            </div>
          </div>
          <ShardsList shardsFetched={dataReady} />

          <div className="row">
            <div className="col-12">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default NodesLayout;
