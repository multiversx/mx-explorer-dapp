import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { PAGE_SIZE, AUCTION_LIST_MAX_NODES } from 'appConstants';
import { IDENTITIES_FIELDS } from 'appConstants';
import {
  Loader,
  Pager,
  PageSize,
  PageState,
  NodesTableHero,
  NodesTable,
  AuctionListFilters,
  AuctionListTable
} from 'components';
import { processNodesIdentities } from 'helpers';
import {
  useAdapter,
  useGetNodeFilters,
  useGetPage,
  useGetSearch,
  useGetSort
} from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { nodesIdentitiesSelector } from 'redux/selectors';
import { setNodesIdentities } from 'redux/slices/nodesIdentities';
import { NodeType, SortOrderEnum } from 'types';

export const NodesAuctionList = () => {
  const dispatch = useDispatch();
  const { nodesIdentities } = useSelector(nodesIdentitiesSelector);
  const { getNodes, getNodesCount, getIdentities } = useAdapter();

  const { search } = useGetSearch();
  const { page, size: pageSize } = useGetPage();
  const nodeFilters = useGetNodeFilters();
  const sort = useGetSort();
  const [searchParams] = useSearchParams();

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
  if (Object.keys(nodeFilters).length === 0) {
    filterText = '';
  }
  if (!sort.sort) {
    sort.sort = 'locked';
    sort.order = SortOrderEnum.desc;
  }

  const hasNoFilters =
    [search, ...Object.keys(nodeFilters)].every((el) => el === undefined) &&
    sort.sort === 'locked';

  const sortLocked = (a: NodeType, b: NodeType) => {
    if (sort.sort !== 'locked') {
      return 0;
    }

    const totalLockedA = new BigNumber(a.stake).plus(a.auctionTopUp ?? 0);
    const totalLockedB = new BigNumber(b.stake).plus(b.auctionTopUp ?? 0);
    const isDesc = sort.order === SortOrderEnum.asc;

    return totalLockedA?.isGreaterThan(totalLockedB)
      ? isDesc
        ? 1
        : -1
      : isDesc
      ? -1
      : 1;
  };

  const fetchNodes = () => {
    setDataReady(undefined);
    const auctionListFilters = {
      ...nodeFilters,
      type: 'validator',
      isAuctioned: true,
      search
    };

    // TODO - temporary until sorting is fixed from api
    const nodesPromiseArray = hasNoFilters
      ? [
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
          })
        ]
      : [
          getNodes({
            ...sort,
            ...auctionListFilters,
            page,
            size: pageSize
          }),
          Promise.resolve({ success: true, data: undefined })
        ];

    Promise.all([...nodesPromiseArray, getNodesCount(auctionListFilters)]).then(
      ([firstNodes, secondNodes, count]) => {
        const qualifiedNodes = firstNodes.data
          ? firstNodes.data
              .filter(
                (node: NodeType) =>
                  node.auctionQualified && !node.isInDangerZone
              )
              .sort(sortLocked)
          : [];
        const dzNodes = firstNodes.data
          ? firstNodes.data
              .filter((node: NodeType) => node.isInDangerZone)
              .sort(sortLocked)
          : [];
        const notQualifiedNodes = firstNodes.data
          ? firstNodes.data
              .filter(
                (node: NodeType) =>
                  !node.auctionQualified && !node.isInDangerZone
              )
              .sort(sortLocked)
          : [];

        const sortedFirst = [
          ...(sort.order === SortOrderEnum.asc
            ? [
                ...(notQualifiedNodes ?? []),
                ...(dzNodes ?? []),
                ...(qualifiedNodes ?? [])
              ]
            : [
                ...(qualifiedNodes ?? []),
                ...(dzNodes ?? []),
                ...(notQualifiedNodes ?? [])
              ])
        ];
        const allNodes = [
          ...(sort.order === SortOrderEnum.asc
            ? [...(secondNodes.data ?? []), ...(sortedFirst ?? [])]
            : [...(sortedFirst ?? []), ...(secondNodes.data ?? [])])
        ];

        const identityArray = allNodes
          .filter((node) => node.identity)
          .map((node) => node.identity);

        if (identityArray.length > 0) {
          const nodesIdentityList = nodesIdentities.map(
            (node) => node.identity
          );
          const newIdentities = identityArray.filter(
            (value) => !nodesIdentityList.includes(value)
          );

          if (newIdentities.length > 0) {
            getIdentities({
              identities: identityArray.join(','),
              fields: IDENTITIES_FIELDS.join(',')
            }).then(({ data, success }) => {
              if (data) {
                const processedNodesIdentities = processNodesIdentities(data);
                dispatch(
                  setNodesIdentities({
                    nodesIdentities: processedNodesIdentities,
                    unprocessed: data,
                    isFetched: success
                  })
                );
              }
            });
          }
        }
        setNodes(allNodes);
        setTotalNodes(count.data);

        setDataReady(
          firstNodes.success && secondNodes.success && count.success
        );
      }
    );
  };

  useEffect(fetchNodes, []);

  return (
    <div className='card nodes-auction-list'>
      <div className='card-header'>
        <NodesTabs />
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <NodesTableHero />
          <AuctionListFilters />
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
        <div className='card-body'>
          <AuctionListTable />
        </div>
      )}
    </div>
  );
};
