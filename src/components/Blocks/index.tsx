import { useGlobalState } from 'context';
import { useNetworkRoute, useURLSearchParams, useSize } from 'helpers';
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { BlocksTable, Loader, Pager, ShardSpan, adapter } from 'sharedComponents';
import { BlockRowType } from 'sharedComponents/BlocksTable';
import FailedBlocks from 'sharedComponents/BlocksTable/FailedBlocks';
import NoBlocks from 'sharedComponents/BlocksTable/NoBlocks';

interface StateType {
  blocks: BlockRowType[];
  startBlockNr: number;
  endBlockNr: number;
}

const Blocks = () => {
  const { page, shard: shardId } = useURLSearchParams();
  const { size, firstPageTicker } = useSize();

  const networkRoute = useNetworkRoute();

  React.useEffect(() => {
    if (shardId !== undefined) {
      document.title = document.title.replace('Blocks', 'Shard Details');
    }
  }, [shardId]);

  const ref = React.useRef(null);
  const [state, setState] = React.useState<StateType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalBlocks, setTotalBlocks] = React.useState<number | '...'>('...');

  const { activeNetworkId } = useGlobalState();

  const { getBlocks, getBlocksCount } = adapter();

  React.useEffect(() => {
    getBlocks({ size, shardId, epochId: undefined }).then(
      ({ success, blocks, endBlockNr, startBlockNr }) => {
        if (ref.current !== null) {
          setState({ blocks, endBlockNr, startBlockNr });
          setDataReady(success);
        }
      }
    );
    getBlocksCount({ size, shardId }).then(({ count, success }) => {
      if (success) {
        if (ref.current !== null) {
          setTotalBlocks(count);
        }
      }
    });
  }, [activeNetworkId, size, shardId, firstPageTicker]);

  return shardId && shardId < 0 ? (
    <Redirect to={networkRoute(`/not-found`)} />
  ) : (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedBlocks />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="container pt-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4">
                  <span data-testid="title">Blocks</span>&nbsp;
                  {shardId !== undefined && shardId >= 0 && <ShardSpan shardId={shardId} />}
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  {state && state.blocks.length > 0 ? (
                    <>
                      <div className="card-body border-0 p-0">
                        <BlocksTable blocks={state.blocks} shardId={shardId} />
                      </div>

                      <div className="card-footer">
                        <Pager
                          page={String(page)}
                          total={totalBlocks !== '...' ? Math.min(totalBlocks, 10000) : totalBlocks}
                          itemsPerPage={25}
                          show={state.blocks.length > 0}
                        />
                      </div>
                    </>
                  ) : (
                    <NoBlocks />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Blocks;
