import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PAGE_SIZE, MAX_AUCTION_LIST_NODES } from 'appConstants';
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
import { NodeType, IdentityType, SortOrderEnum } from 'types';

export const NodesAuctionList = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();

  const { getNodes, getNodesCount, getIdentities } = useAdapter();
  const { search } = useGetSearch();
  const { page, size: pageSize } = useGetPage();
  const nodeFilters = useGetNodeFilters();
  const sort = useGetSort();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [identities, setIdentities] = useState<IdentityType[]>([]);
  const [totalNodes, setTotalNodes] = useState<number | '...'>('...');
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const identityFields = ['identity', 'name', 'avatar'];

  const isCustomSize = ![PAGE_SIZE, MAX_AUCTION_LIST_NODES].includes(pageSize);
  const size = isCustomSize ? pageSize : MAX_AUCTION_LIST_NODES;
  const hasTresholdRow = [search, ...Object.keys(nodeFilters)].every(
    (el) => el === undefined
  );
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

  const fetchNodes = () => {
    setDataReady(undefined);
    const auctionListFilters = {
      ...nodeFilters,
      isAuctioned: true,
      search
    };

    Promise.all([
      // TODO: set in node layout state
      getIdentities({ fields: identityFields.join(',') }),
      getNodes({
        ...sort,
        ...auctionListFilters,
        page,
        size
      }),
      getNodesCount(auctionListFilters)
    ]).then(([identitiesData, nodesData, count]) => {
      setIdentities(identitiesData.data);
      setNodes(nodesData.data);
      setTotalNodes(count.data);

      if (ref.current !== null) {
        setDataReady(
          identitiesData.success && nodesData.success && count.success
        );
      }
    });
  };

  useEffect(fetchNodes, [searchParams]);

  return (
    <div className='card nodes-auction-list' ref={ref}>
      <div className='card-header'>
        <NodesTabs />
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <NodesTableHero />
          <AuctionListFilters />
          {dataReady === true && (isCustomSize || !hasTresholdRow) && (
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
      {dataReady === true && (
        <>
          {nodes.length === 0 ? (
            <PageState
              icon={faCogs}
              title={`No ${
                filterText ? `${filterText} ` : ''
              }Nodes in Auction List`}
            />
          ) : (
            <>
              <div className='card-body'>
                <NodesTable auctionList>
                  <NodesTable.Body
                    nodes={nodes}
                    identities={identities}
                    hasTresholdRow={hasTresholdRow}
                    auctionList
                  />
                </NodesTable>
              </div>
              {(isCustomSize || !hasTresholdRow) && (
                <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
                  <Pager total={totalNodes} itemsPerPage={size} show />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
