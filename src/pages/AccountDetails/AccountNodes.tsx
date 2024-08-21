import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  ELLIPSIS,
  NODE_STATUS_PREVIEW_FIELDS,
  MAX_RESULTS
} from 'appConstants';
import {
  Loader,
  Pager,
  PageSize,
  PageState,
  NodesHeader,
  NodesFilters,
  NodesTable,
  NodesOverview
} from 'components';
import {
  useAdapter,
  useGetNodeFilters,
  useGetPage,
  useFetchStake,
  useGetSearch,
  useFetchNodesOverview
} from 'hooks';
import { faCoins } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, nodesOverviewSelector } from 'redux/selectors';
import { NodeType, NodeStatusEnum, NodeTypeEnum } from 'types';

export const AccountNodes = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { isFetched: isNodesOverviewFetched } = useSelector(
    nodesOverviewSelector
  );
  const [searchParams] = useSearchParams();
  const { page, size } = useGetPage();
  const { search } = useGetSearch();
  const nodeFilters = useGetNodeFilters();
  const { getNodes, getNodesCount } = useAdapter();
  const { hash: address } = useParams();

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [accountNodes, setAccountNodes] = useState<NodeType[]>([]);
  const [accountNodesCount, setAccountNodesCount] = useState<
    number | typeof ELLIPSIS
  >(ELLIPSIS);

  const { type, status, isAuctioned } = nodeFilters;

  const fetchAccountNodes = () => {
    setDataReady(undefined);
    Promise.all([
      getNodes({
        ...nodeFilters,
        search,
        page,
        size,
        owner: address
      }),
      getNodesCount({ ...nodeFilters, owner: address, withIdentityInfo: true })
    ]).then(([accountNodesData, accountNodesCountData]) => {
      if (accountNodesData.success && accountNodesCountData.success) {
        setAccountNodes(accountNodesData.data);
        setAccountNodesCount(accountNodesCountData.data);
      }
      setDataReady(accountNodesData.success && accountNodesCountData.success);
    });
  };

  useFetchStake();
  useFetchNodesOverview({
    owner: address,
    type: NodeTypeEnum.validator,
    fields: NODE_STATUS_PREVIEW_FIELDS.join(','),
    size: MAX_RESULTS
  });

  useEffect(() => {
    fetchAccountNodes();
  }, [activeNetworkId, address, searchParams]);

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
          <NodesOverview title='Owned Nodes Status' className='mb-3' />
          <NodesHeader searchValue={accountNodesCount} smallHeader />
          <div className='d-flex flex-wrap align-items-center gap-3 w-100'>
            <NodesFilters />
            <Pager
              total={accountNodesCount}
              className='d-flex ms-auto me-auto me-sm-0'
              showFirstAndLast={false}
              show
            />
          </div>
        </div>
      </div>

      {(dataReady === undefined || !isNodesOverviewFetched) && (
        <Loader data-testid='nodesLoader' />
      )}
      {dataReady === false && (
        <PageState icon={faCoins} title='Unable to load Nodes' isError />
      )}
      {dataReady === true && isNodesOverviewFetched && (
        <>
          <div className='card-body'>
            <NodesTable
              type={type as NodeType['type']}
              status={status as NodeType['status']}
              auctionList={Boolean(isAuctioned)}
              queue={status === NodeStatusEnum.queued}
            >
              <NodesTable.Body
                nodes={accountNodes}
                type={type as NodeType['type']}
                status={status as NodeType['status']}
                auctionList={Boolean(isAuctioned)}
                queue={status === NodeStatusEnum.queued}
              />
            </NodesTable>
          </div>
          <div className='card-footer table-footer'>
            <PageSize />
            <Pager total={accountNodesCount} show={accountNodes.length > 0} />
          </div>
        </>
      )}
    </div>
  );
};
