import { useGlobalState } from 'context';
import { networkRoute, useURLSearchParams } from 'helpers';
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { BlocksTable, Loader, Pager, ShardSpan, adapter } from 'sharedComponents';
import { BlockType } from 'sharedComponents/BlocksTable';
import FailedBlocks from 'sharedComponents/BlocksTable/FailedBlocks';
import NoBlocks from 'sharedComponents/BlocksTable/NoBlocks';

interface StateType {
  blocks: BlockType[];
  startBlockNr: number;
  endBlockNr: number;
}

const Blocks: React.FC = () => {
  const { page, shard } = useURLSearchParams();
  const shardId = shard;

  React.useEffect(() => {
    if (shardId !== undefined) {
      document.title = document.title.replace('Blocks', 'Shard Details');
    }
  }, [shardId]);

  const ref = React.useRef(null);
  const size = page;
  const [state, setState] = React.useState<StateType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalBlocks, setTotalBlocks] = React.useState<number | '...'>('...');

  const {
    refresh: { timestamp },
    activeNetworkId,
  } = useGlobalState();

  const { getBlocks, getBlocksCount } = adapter();

  const refreshFirstPage = size === 1 ? timestamp : 0;

  const fetchBlocks = () => {
    if (ref.current !== null) {
      getBlocks({ size, shardId, epochId: undefined }).then(
        ({ success, blocks, endBlockNr, startBlockNr }) => {
          if (ref.current !== null) {
            setState({ blocks, endBlockNr, startBlockNr });
            setDataReady(success);
          }
        }
      );

      getBlocksCount({ size, shardId }).then(({ count, success }) => {
        if (ref.current !== null && success) {
          setTotalBlocks(count);
        }
      });
    }
  };

  React.useEffect(fetchBlocks, [activeNetworkId, size, shardId, refreshFirstPage]);

  return shard && shard < 0 ? (
    <Redirect to={networkRoute({ to: `/not-found`, activeNetworkId })} />
  ) : (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedBlocks />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="container py-spacer">
            <div className="row page-header mb-spacer">
              <div className="col-12">
                <h3 className="page-title">
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
                      <div className="card-header">
                        <div className="card-header-item">
                          Showing last 10,000
                          {totalBlocks !== '...' && (
                            <> of {totalBlocks.toLocaleString('en')}</>
                          )}{' '}
                          blocks
                        </div>
                      </div>
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
