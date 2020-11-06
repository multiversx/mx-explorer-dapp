import React from 'react';
import ShardsList from './ShardsList';
import { adapter, Loader } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';

const NodesLayout = ({ children }: { children: React.ReactNode }) => {
  const { getShards } = adapter();
  const dispatch = useGlobalDispatch();
  const { shards } = useGlobalState();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>(
    shards.length === 0 ? undefined : true
  );

  const fetchShards = () => {
    if (shards.length === 0) {
      getShards().then((shards) => {
        if (shards.success) {
          dispatch({
            type: 'setShards',
            shards: shards.data,
          });
          setDataReady(true);
        } else {
          setDataReady(false);
        }
      });
    }
  };

  React.useEffect(fetchShards, []);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady !== undefined && (
        <div className="container py-spacer">
          <div className="row page-header mb-spacer">
            <div className="col-12">
              <h3 className="page-title">
                <span data-testid="title">Nodes</span>
              </h3>
            </div>
          </div>
          <ShardsList />

          <div className="row">
            <div className="col-12">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default NodesLayout;
