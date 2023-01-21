import { useGlobalState } from 'context';
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { useNetworkRoute, useURLSearchParams, useSize } from 'helpers';
import { BlockType } from 'helpers/types';
import { BlocksTable, Loader, Pager, ShardSpan, useAdapter } from 'components';
import { FailedBlocks } from 'components/BlocksTable/FailedBlocks';
import { NoBlocks } from 'components/BlocksTable/NoBlocks';

interface StateType {
  blocks: BlockType[];
  startBlockNr: number;
  endBlockNr: number;
}

export const Blocks = () => {
  const { page, shard } = useURLSearchParams();
  const { size, firstPageTicker } = useSize();

  const networkRoute = useNetworkRoute();

  React.useEffect(() => {
    if (shard !== undefined) {
      document.title = document.title.replace('Blocks', 'Shard Details');
    }
  }, [shard]);

  const ref = React.useRef(null);
  const [state, setState] = React.useState<StateType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalBlocks, setTotalBlocks] = React.useState<number | '...'>('...');

  const { activeNetworkId } = useGlobalState();

  const { getBlocks, getBlocksCount } = useAdapter();

  React.useEffect(() => {
    getBlocks({ size, shard, withProposerIdentity: true }).then(({ success, data }) => {
      if (ref.current !== null) {
        if (success && data) {
          const { blocks, endBlockNr, startBlockNr } = data;
          const existingHashes = state ? state.blocks.map((block: BlockType) => block.hash) : [];
          const newBlocks = blocks.map((block: BlockType) => ({
            ...block,
            isNew: !existingHashes.includes(block.hash),
          }));
          setState({ blocks: newBlocks, endBlockNr, startBlockNr });
        }
        setDataReady(success);
      }
    });
    getBlocksCount({ size, shard }).then(({ data: count, success }) => {
      if (ref.current !== null && success) {
        setTotalBlocks(count);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size, shard, firstPageTicker]);

  return shard && shard < 0 ? (
    <Redirect to={networkRoute(`/not-found`)} />
  ) : (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedBlocks />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="container page-content">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  {state && state.blocks.length > 0 ? (
                    <>
                      <div className="card-header">
                        <div className="card-header-item d-flex justify-content-between align-items-center">
                          <h6 className="m-0" data-testid="title">
                            Blocks
                            {shard !== undefined && shard >= 0 && (
                              <>
                                {' '}
                                <ShardSpan shard={shard} />
                              </>
                            )}
                          </h6>
                          <div className="d-none d-sm-flex">
                            <Pager
                              page={String(page)}
                              total={
                                totalBlocks !== '...' ? Math.min(totalBlocks, 10000) : totalBlocks
                              }
                              itemsPerPage={25}
                              show={state.blocks.length > 0}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card-body border-0 p-0">
                        <BlocksTable
                          blocks={state.blocks}
                          shard={shard}
                          showProposerIdentity={true}
                        />
                      </div>

                      <div className="card-footer d-flex justify-content-end">
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
