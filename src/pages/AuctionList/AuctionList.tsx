import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Loader, Pager, PageState, NodesTableHero } from 'components';

import {
  useAdapter,
  useGetNodeFilters,
  useGetPage,
  useGetSearch,
  useGetSort
} from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { validatorsRoutes } from 'routes';
import { NodeType, IdentityType, SortOrderEnum } from 'types';

import { AuctionListFilters } from './components/AuctionListFilters';
import { AuctionListRow } from './components/AuctionListRow';

export const AuctionList = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();

  const { getNodes, getNodesCount, getIdentities } = useAdapter();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const nodeFilters = useGetNodeFilters();
  const sort = useGetSort();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [identities, setIdentities] = useState<IdentityType[]>([]);
  const [totalNodes, setTotalNodes] = useState<number | '...'>('...');
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  if (!sort.sort) {
    sort.sort = 'position';
    sort.order = SortOrderEnum.asc;
  }

  const fetchNodes = () => {
    setDataReady(undefined);

    Promise.all([
      getIdentities(),
      getNodes({
        ...nodeFilters,
        ...sort,
        type: 'validator',
        status: 'queued',
        isAuctioned: true,
        search,
        page,
        size
      }),
      getNodesCount({
        ...nodeFilters,
        type: 'validator',
        status: 'queued',
        isAuctioned: true,
        search
      })
    ]).then(([identitiesData, nodesData, count]) => {
      setIdentities(identitiesData.data);
      setNodes(nodesData.data);
      setTotalNodes(count.data);

      if (ref.current !== null) {
        setDataReady(identitiesData.data && nodesData.success && count.success);
      }
    });
  };

  useEffect(fetchNodes, [searchParams]);

  return (
    <div className='card auction-list' ref={ref}>
      <div className='card-header'>
        <NodesTabs />
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <NodesTableHero />
          <AuctionListFilters baseRoute={validatorsRoutes.auctionList} />
          {dataReady === true && (
            <Pager
              total={totalNodes}
              className='d-flex ms-auto me-auto me-sm-0'
              show
            />
          )}
        </div>
      </div>

      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState icon={faCogs} title='Unable to load Nodes' isError />
      )}
      {dataReady === true && (
        <>
          <div className='card-body'>
            <div className='table-wrapper'>
              <table className='table auction-list-table mb-0'>
                <thead>
                  <tr>
                    <th className='th-rank'>Position</th>
                    <th className='th-eligibility'>Qualified</th>
                    <th className='th-identity'>Validator</th>
                    <th className='th-key'>Key</th>
                    <th className='th-stake'>Stake / Node</th>
                    <th className='th-treshold'>Until Treshold</th>
                    <th className='th-info'></th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node, i) => {
                    return (
                      <AuctionListRow
                        node={node}
                        identities={identities}
                        key={node.bls}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
            <Pager total={totalNodes} show />
          </div>
        </>
      )}
    </div>
  );
};
