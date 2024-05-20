import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import {
  Loader,
  Pager,
  PageSize,
  PageState,
  NodesTable,
  NodesFilters,
  NodesHeader
} from 'components';
import {
  useAdapter,
  useGetNodeFilters,
  useGetPage,
  useGetSearch,
  useGetSort
} from 'hooks';
import { faCogs } from 'icons/regular';
import { ProviderTabs } from 'layouts/ProviderLayout/ProviderTabs';
import { NodeStatusEnum, NodeType } from 'types';

export const ProviderDetails = () => {
  const { hash: address } = useParams() as any;
  const [searchParams] = useSearchParams();
  const { getNodes, getNodesCount } = useAdapter();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const nodeFilters = useGetNodeFilters();
  const sort = useGetSort();
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [totalNodes, setTotalNodes] = useState<number | typeof ELLIPSIS>(
    ELLIPSIS
  );

  const { type, status, isAuctioned } = nodeFilters;

  const fetchNodes = () => {
    setDataReady(undefined);

    Promise.all([
      getNodes({
        ...nodeFilters,
        ...sort,
        search,
        provider: address,
        page,
        size
      }),
      getNodesCount({ ...nodeFilters, ...sort, search, provider: address })
    ]).then(([nodesData, count]) => {
      setNodes(nodesData.data);
      setTotalNodes(count.data);

      setDataReady(nodesData.success && count.success);
    });
  };

  useEffect(fetchNodes, [searchParams]);

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <ProviderTabs />
          <NodesHeader searchValue={totalNodes} />
          <div className='d-flex flex-wrap align-items-center gap-3 w-100'>
            <NodesFilters />
            <Pager
              total={totalNodes}
              className='d-flex ms-auto me-auto me-sm-0'
              showFirstAndLast={false}
              show
            />
          </div>
        </div>
      </div>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState icon={faCogs} title='Unable to load nodes' isError />
      )}
      {dataReady === true && (
        <>
          <div className='card-body'>
            <NodesTable
              type={type as NodeType['type']}
              status={status as NodeType['status']}
              auctionList={Boolean(isAuctioned)}
              queue={status === NodeStatusEnum.queued}
            >
              <NodesTable.Body
                nodes={nodes}
                type={type as NodeType['type']}
                status={status as NodeType['status']}
                auctionList={Boolean(isAuctioned)}
                queue={status === NodeStatusEnum.queued}
              />
            </NodesTable>
          </div>
          <div className='card-footer table-footer'>
            <PageSize />
            <Pager total={totalNodes} show={nodes.length > 0} />
          </div>
        </>
      )}
    </div>
  );
};
