import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import {
  Loader,
  Pager,
  PageSize,
  PageState,
  NodesHeader,
  NodesFilters,
  NodesTable
} from 'components';
import {
  useAdapter,
  useGetNodeFilters,
  useGetPage,
  useFetchStake,
  useGetSearch
} from 'hooks';
import { faCoins } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { NodeType, NodeStatusEnum } from 'types';

export const AccountNodes = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
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
        owner: address,
        withIdentityInfo: true
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

  useEffect(() => {
    fetchAccountNodes();
  }, [activeNetworkId, address, searchParams]);

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
          <NodesHeader searchValue={accountNodesCount} />
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

      {dataReady === undefined && <Loader data-testid='nodesLoader' />}
      {dataReady === false && (
        <PageState icon={faCoins} title='Unable to load Nodes' isError />
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
