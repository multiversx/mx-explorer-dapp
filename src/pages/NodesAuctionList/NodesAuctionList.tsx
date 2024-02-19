import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PAGE_SIZE, AUCTION_LIST_MAX_NODES } from 'appConstants';
import {
  Loader,
  Pager,
  PageState,
  NodesTableHero,
  NodesTable,
  AuctionListFilters
} from 'components';
import {
  useAdapter,
  useGetNodeFilters,
  useGetPage,
  useGetSearch,
  useGetSort
} from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { NodeType, SortOrderEnum } from 'types';

export const NodesAuctionList = () => {
  const [searchParams] = useSearchParams();

  const { getNodes, getNodesCount } = useAdapter();
  const { search } = useGetSearch();
  const { page, size: pageSize } = useGetPage();
  const nodeFilters = useGetNodeFilters();
  const sort = useGetSort();
  const [nodes, setNodes] = useState<NodeType[]>([]);

  const [totalNodes, setTotalNodes] = useState<number | '...'>('...');
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const isCustomSize = ![PAGE_SIZE, AUCTION_LIST_MAX_NODES].includes(pageSize);
  const size = isCustomSize ? pageSize : AUCTION_LIST_MAX_NODES;
  let filterText = '';
  if (!nodeFilters.isQualified) {
    filterText = 'Unqualified';
  }
  if (nodeFilters.isQualified) {
    filterText = 'Qualified';
  }
  if (nodeFilters.isAuctionDangerZone) {
    filterText = 'Danger Zone';
  }

  if (!sort.sort) {
    sort.sort = 'auctionPosition';
    sort.order = SortOrderEnum.asc;
  }

  const hasNoFilters =
    [search, ...Object.keys(nodeFilters)].every((el) => el === undefined) &&
    sort.sort === 'auctionPosition';

  const fetchNodes = () => {
    setDataReady(undefined);
    const auctionListFilters = {
      ...nodeFilters,
      isAuctioned: true,
      search
    };

    // TODO - temporary until sorting is fixed from api
    if (hasNoFilters) {
      Promise.all([
        getNodes({
          ...sort,
          ...auctionListFilters,
          isQualified: true,
          page,
          size
        }),
        getNodes({
          ...sort,
          ...auctionListFilters,
          isQualified: false,
          page,
          size
        }),
        getNodesCount(auctionListFilters)
      ]).then(([qualifiedNodesData, notQualifiedNodesData, count]) => {
        setNodes([
          ...(sort.order === SortOrderEnum.desc
            ? [
                ...(notQualifiedNodesData.data ?? []),
                ...(qualifiedNodesData.data ?? [])
              ]
            : [
                ...(qualifiedNodesData.data ?? []),
                ...(notQualifiedNodesData.data ?? [])
              ])
        ]);
        setTotalNodes(count.data);

        setDataReady(
          qualifiedNodesData.success &&
            notQualifiedNodesData.success &&
            count.success
        );
      });
    } else {
      Promise.all([
        getNodes({
          ...sort,
          ...auctionListFilters,
          page,
          size
        }),
        getNodesCount(auctionListFilters)
      ]).then(([nodesData, count]) => {
        setNodes(nodesData.data);
        setTotalNodes(count.data);

        setDataReady(nodesData.success && count.success);
      });
    }
  };

  useEffect(fetchNodes, [searchParams]);

  return (
    <div className='card nodes-auction-list'>
      <div className='card-header'>
        <NodesTabs />
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <NodesTableHero />
          <AuctionListFilters />
          {dataReady === true && (isCustomSize || !hasNoFilters) && (
            <Pager
              itemsPerPage={size}
              total={totalNodes}
              className='d-flex ms-auto me-auto me-sm-0'
              show
            />
          )}
        </div>
      </div>

      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState icon={faCogs} title='Unable to load Auction List' isError />
      )}
      {dataReady === true && nodes.length === 0 && (
        <PageState
          icon={faCogs}
          title={`No ${
            filterText ? `${filterText} ` : ''
          }Nodes in Auction List`}
        />
      )}

      {dataReady === true && nodes.length > 0 && (
        <>
          <div className='card-body'>
            <NodesTable auctionList>
              <NodesTable.Body
                nodes={nodes}
                hasTresholdRow={hasNoFilters}
                auctionList
              />
            </NodesTable>
          </div>
          {(isCustomSize || !hasNoFilters) && (
            <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
              <Pager total={totalNodes} itemsPerPage={size} show />
            </div>
          )}
        </>
      )}
    </div>
  );
};
