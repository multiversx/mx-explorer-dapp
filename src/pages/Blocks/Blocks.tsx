import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { BlocksTable, Loader, Pager, ShardSpan } from 'components';
import { FailedBlocks } from 'components/BlocksTable/FailedBlocks';
import { NoBlocks } from 'components/BlocksTable/NoBlocks';
import {
  useAdapter,
  useNetworkRoute,
  useURLSearchParams,
  useSize
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
  const { page, shard } = useURLSearchParams();
  const { size, firstPageTicker } = useSize();
  const pageHeadersBlocks = useSelector(pageHeadersBlocksStatsSelector);

  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();

  const [state, setState] = useState<StateType>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [totalBlocks, setTotalBlocks] = useState<number | '...'>('...');

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getBlocks, getBlocksCount } = useAdapter();

  useEffect(() => {
    if (shard !== undefined) {
      document.title = document.title.replace('Blocks', 'Shard Details');
    }
  }, [shard]);

  useEffect(() => {
    getBlocks({ size, shard, withProposerIdentity: true }).then(
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
    getBlocksCount({ size, shard }).then(({ data: count, success }) => {
      if (ref.current !== null && success) {
        setTotalBlocks(count);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size, shard, firstPageTicker, searchParams]);

  return shard && shard < 0 ? (
    navigate(networkRoute('/not-found'))
  ) : (
    <>
      {(dataReady === undefined ||
        Object.keys(pageHeadersBlocks).length === 0) && <Loader />}
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
                            page={String(page)}
                            total={
                              totalBlocks !== '...'
                                ? Math.min(totalBlocks, 10000)
                                : totalBlocks
                            }
                            itemsPerPage={25}
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

                      <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
                        <Pager
                          page={String(page)}
                          total={
                            totalBlocks !== '...'
                              ? Math.min(totalBlocks, 10000)
                              : totalBlocks
                          }
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
