import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  useGetSort,
  useFetchNodesCount
} from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { NodeType } from 'types';

export const Nodes = () => {
  const [searchParams] = useSearchParams();
  const { getNodes, getNodesCount } = useAdapter();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const nodeFilters = useGetNodeFilters();
  const sort = useGetSort();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [totalNodes, setTotalNodes] = useState<number | typeof ELLIPSIS>(
    ELLIPSIS
  );
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const { type, status, isAuctioned } = Object.fromEntries(searchParams);

  const fetchNodes = () => {
    setDataReady(undefined);
    Promise.all([
      getNodes({
        ...nodeFilters,
        ...sort,
        search,
        page,
        size,
        withIdentityInfo: true
      }),
      getNodesCount({ ...nodeFilters, ...sort, search })
    ]).then(([nodesData, count]) => {
      setNodes(nodesData.data);
      setTotalNodes(count.data);

      setDataReady(nodesData.success && count.success);
    });
  };
  useFetchNodesCount();

  useEffect(fetchNodes, [searchParams]);

  return (
    <div className='card'>
      <div className='card-header'>
        <NodesTabs />
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <NodesHeader searchValue={totalNodes} />
          <div className='d-flex flex-wrap align-items-center gap-3 w-100'>
            <NodesFilters showGlobalValues showObservers showValidatorNodes />
            <Pager
              total={totalNodes}
              className='d-flex ms-auto me-auto me-sm-0'
              show
            />
          </div>
        </div>
      </div>

      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState icon={faCogs} title='Unable to load Nodes' isError />
      )}

      {dataReady === true && (
        <>
          <div className='card-body'>
            <NodesTable
              type={type as NodeType['type']}
              status={status as NodeType['status']}
              auctionList={Boolean(isAuctioned)}
            >
              <NodesTable.Body
                nodes={nodes}
                type={type as NodeType['type']}
                status={status as NodeType['status']}
                auctionList={Boolean(isAuctioned)}
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
