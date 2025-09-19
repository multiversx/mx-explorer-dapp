import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useSearchParams } from 'react-router-dom';

import { BlocksTable } from 'components';

import {
  useAdapter,
  useGetPage,
  useGetBlockFilters,
  useFetchBlocks,
  useNetworkRoute
} from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';

export const Blocks = () => {
  const [searchParams] = useSearchParams();
  const urlParams = useGetBlockFilters();
  const networkRoute = useNetworkRoute();

  const { shard: filterShard } = urlParams;
  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getBlocks, getBlocksCount } = useAdapter();

  const shard = filterShard !== undefined ? Number(filterShard) : undefined;

  const { fetchBlocks, blocks, totalBlocks, isDataReady, dataChanged } =
    useFetchBlocks({
      dataPromise: getBlocks,
      dataCountPromise: getBlocksCount,
      filters: { shard, withProposerIdentity: true },
      subscription: WebsocketSubcriptionsEnum.subscribeBlocks,
      event: WebsocketEventsEnum.blocksUpdate
    });

  useEffect(() => {
    fetchBlocks(Boolean(searchParams.toString()));
  }, [searchParams, activeNetworkId, firstPageRefreshTrigger]);

  useEffect(() => {
    if (shard !== undefined) {
      document.title = document.title.replace('Blocks', 'Shard Details');
    }
  }, [shard]);

  if (shard && shard < 0) {
    return <Navigate to={networkRoute('/not-found')} />;
  }

  return (
    <div className='container page-content'>
      <div className='card p-0'>
        <div className='row'>
          <div className='col-12'>
            <BlocksTable
              blocks={blocks}
              totalBlocks={totalBlocks}
              dataChanged={dataChanged}
              isDataReady={isDataReady}
              showProposerIdentity={true}
              shard={shard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
