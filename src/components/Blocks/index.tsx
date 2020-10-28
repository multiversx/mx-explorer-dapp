import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { useURLSearchParams } from 'helpers';
import * as React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { BlocksTable, Loader, Pager, ShardSpan, adapter } from 'sharedComponents';
import { BlockType } from 'sharedComponents/Adapter/functions/getBlock';

interface StateType {
  blocks: BlockType[];
  startBlockNr: number;
  endBlockNr: number;
  blocksFetched: boolean;
}

const initialState = {
  blocks: [],
  startBlockNr: 0,
  endBlockNr: 0,
  blocksFetched: true,
};

function isValidInt(number: number) {
  return !(
    isNaN(number) ||
    isNaN(parseInt(number.toString())) ||
    !/^\+?(0|[1-9]\d*)$/.test(number.toString())
  );
}

const Blocks: React.FC = () => {
  const { page, shard } = useURLSearchParams();
  const shardId = parseInt(shard!) >= 0 ? parseInt(shard!) : undefined;

  const ref = React.useRef(null);
  const size = !isNaN(parseInt(page)) ? parseInt(page) : 1;
  const [state, setState] = React.useState<StateType>(initialState);
  const [totalBlocks, setTotalBlocks] = React.useState<number | '...'>('...');

  const {
    refresh: { timestamp },
    activeNetworkId,
  } = useGlobalState();

  const { getBlocks, getBlocksCount } = adapter();

  const refreshFirstPage = size === 1 ? timestamp : 0;

  const fetchBlocks = () => {
    if (ref.current !== null) {
      getBlocks({ size, shardId, epochId: undefined }).then((data) => {
        if (ref.current !== null) {
          if (data.blocksFetched) {
            setState(data);
          } else if (state.blocks.length === 0) {
            setState({ ...initialState, blocksFetched: false });
          }
        }
      });

      getBlocksCount({ size, shardId }).then(({ count, success }) => {
        if (ref.current !== null && success) {
          setTotalBlocks(count);
        }
      });
    }
  };

  React.useEffect(fetchBlocks, [activeNetworkId, size, shardId, refreshFirstPage]); // run the operation only once since the parameter does not change

  const slug = !isNaN(shardId!) ? `blocks/shard/${shardId}` : 'blocks';

  const Component = () => {
    return (
      <div ref={ref}>
        <div className="container pt-3 pb-3">
          <div className="row">
            <div className="col-12">
              <h4>
                <span data-testid="title">Blocks</span>&nbsp;
                {shardId !== undefined && shardId >= 0 && (
                  <>
                    <ShardSpan shardId={shardId} />
                  </>
                )}
              </h4>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              {!state.blocksFetched ? (
                <div className="card" data-testid="errorScreen">
                  <div className="card-body card-details">
                    <div className="empty">
                      <FontAwesomeIcon icon={faCube} className="empty-icon" />
                      <span className="h4 empty-heading">No blocks found</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {state.blocks.length > 0 ? (
                    <div className="card">
                      <div className="card-body card-list">
                        <p className="mb-0">
                          Showing last 10,000
                          {totalBlocks !== '...' && (
                            <> of {totalBlocks.toLocaleString('en')}</>
                          )}{' '}
                          blocks
                        </p>
                        <BlocksTable blocks={state.blocks} shardId={shardId} />
                        <Pager
                          page={page}
                          slug={slug}
                          total={totalBlocks !== '...' ? Math.min(totalBlocks, 10000) : totalBlocks}
                          itemsPerPage={25}
                          show={state.blocks.length > 0}
                        />
                      </div>
                    </div>
                  ) : (
                    <Loader />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const memoBlocks = React.useMemo(Component, [
    timestamp,
    state.blocksFetched,
    state.blocks.length,
  ]);

  if (shard && !isValidInt(parseInt(shard!))) {
    return <Redirect to={activeNetworkId ? `/${activeNetworkId}/not-found` : '/not-found'} />;
  }

  return memoBlocks;
};

export default Blocks;
