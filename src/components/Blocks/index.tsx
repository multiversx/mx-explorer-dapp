import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { useGlobalState } from 'context';
import { networkRoute, useURLSearchParams } from 'helpers';
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { BlocksTable, Loader, Pager, ShardSpan, adapter, PageState } from 'sharedComponents';
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
  const [state, setState] = React.useState<StateType>(initialState);
  const [blocksFetched, setBlocksFetched] = React.useState<boolean | undefined>();
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
          setState(data);
          setBlocksFetched(data.blocksFetched);
        }
      });

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
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4>
              <span data-testid="title">Blocks</span>&nbsp;
              {shardId !== undefined && shardId >= 0 && <ShardSpan shardId={shardId} />}
            </h4>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            {blocksFetched === undefined && <Loader dataTestId="loader" hideCard />}
            {blocksFetched === false && (
              <PageState
                icon={faCube}
                title={'Unable to load blocks'}
                className="py-spacer d-flex h-100 align-items-center justify-content-center"
                data-testid="errorScreen"
              />
            )}
            {state.blocks.length === 0 && blocksFetched && (
              <PageState
                icon={faCube}
                title="No blocks found"
                className="py-spacer d-flex h-100 align-items-center justify-content-center"
                data-testid="noBlocks"
              />
            )}
            {state.blocks.length > 0 && (
              <>
                <p className="mb-0">
                  Showing last 10,000
                  {totalBlocks !== '...' && <> of {totalBlocks.toLocaleString('en')}</>} blocks
                </p>
                <BlocksTable blocks={state.blocks} shardId={shardId} />
                <Pager
                  page={String(page)}
                  total={totalBlocks !== '...' ? Math.min(totalBlocks, 10000) : totalBlocks}
                  itemsPerPage={25}
                  show={state.blocks.length > 0}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blocks;
