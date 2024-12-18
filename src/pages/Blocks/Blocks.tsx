import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, Navigate } from 'react-router-dom';

import { BlocksTable, Loader, Pager, PageSize, ShardSpan } from 'components';
import { FailedBlocks } from 'components/BlocksTable/components/FailedBlocks';
import { NoBlocks } from 'components/BlocksTable/components/NoBlocks';
import {
  useAdapter,
  useNetworkRoute,
  useGetBlockFilters,
  useGetPage,
  useHasGrowthWidgets
} from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { BlockType } from 'types';

import { pageHeadersBlocksStatsSelector } from '../../redux/selectors/pageHeadersBlocksStats';

interface StateType {
  blocks: BlockType[];
  startBlockNr: number;
  endBlockNr: number;
}

export const Blocks = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();

  const networkRoute = useNetworkRoute();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { shard: filterShard } = useGetBlockFilters();
  const { page, size, firstPageRefreshTrigger } = useGetPage();
  const { getBlocks, getBlocksCount } = useAdapter();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const pageHeadersBlocks = useSelector(pageHeadersBlocksStatsSelector);

  const [state, setState] = useState<StateType>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [totalBlocks, setTotalBlocks] = useState<number | '...'>('...');

  const shard = filterShard !== undefined ? Number(filterShard) : undefined;

  useEffect(() => {
    if (shard !== undefined) {
      document.title = document.title.replace('Blocks', 'Shard Details');
    }
  }, [shard]);

  useEffect(() => {
    getBlocks({ page, size, shard, withProposerIdentity: true }).then(
      ({ success, data }) => {
        if (ref.current !== null) {
          if (success && data) {
            const { blocks, endBlockNr, startBlockNr } = data;
            const existingHashes = state
              ? state.blocks.map((block: BlockType) => block.hash)
              : [];
            const newBlocks = blocks.map((block: BlockType) => ({
              ...block,
              isNew: !existingHashes.includes(block.hash)
            }));
            setState({ blocks: newBlocks, endBlockNr, startBlockNr });
          }
          setDataReady(success);
        }
      }
    );
    getBlocksCount({ page, shard }).then(({ data: count, success }) => {
      if (ref.current !== null && success) {
        setTotalBlocks(count);
      }
    });
  }, [activeNetworkId, shard, firstPageRefreshTrigger, searchParams]);

  return shard && shard < 0 ? (
    <Navigate to={networkRoute('/not-found')} />
  ) : (
    <>
      {(dataReady === undefined ||
        (hasGrowthWidgets && Object.keys(pageHeadersBlocks).length === 0)) && (
        <Loader />
      )}
      {dataReady === false && <FailedBlocks />}

      <div ref={ref}>
        {dataReady === true && (
          <div className='container page-content'>
            <div className='row'>
              <div className='col-12'>
                <div className='card'>
                  {state && state.blocks.length > 0 ? (
                    <>
                      <div className='card-header'>
                        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                          <h5
                            className='table-title d-flex align-items-center'
                            data-testid='title'
                          >
                            Blocks
                            {shard !== undefined && shard >= 0 && (
                              <span className='ms-1'>
                                from <ShardSpan shard={shard} />
                              </span>
                            )}
                          </h5>
                          <Pager
                            total={totalBlocks}
                            show={state.blocks.length > 0}
                            className='d-flex ms-auto me-auto me-sm-0'
                          />
                        </div>
                      </div>

                      <div className='card-body'>
                        <BlocksTable
                          blocks={state.blocks}
                          shard={shard}
                          showProposerIdentity={true}
                        />
                      </div>

                      <div className='card-footer table-footer'>
                        <PageSize />
                        <Pager
                          total={totalBlocks}
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
