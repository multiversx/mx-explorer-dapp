import React, { useEffect, useRef, useState } from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons';
import { useLocation } from 'react-router-dom';

import { Loader, Pager, PageState, NodesTable, NodesFilters } from 'components';
import {
  useAdapter,
  useGetNodeFilters,
  useGetPage,
  useGetSearch,
  useGetSort
} from 'hooks';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { validatorsRoutes } from 'routes';
import { NodeType } from 'types';

export const NodesQueue = () => {
  const ref = useRef(null);
  const { search: searchLocation } = useLocation();
  const { getNodes, getNodesCount } = useAdapter();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const nodeFilters = useGetNodeFilters();
  const sort = useGetSort();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [totalNodes, setTotalNodes] = useState<number | '...'>('...');
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  if (!sort.sort) {
    sort.sort = 'position';
    sort.order = 'asc';
  }

  const fetchNodes = () => {
    const queryObject = {
      ...nodeFilters,
      ...sort,
      search,
      type: 'validator',
      status: 'queued'
    };
    setDataReady(undefined);

    Promise.all([
      getNodes({ ...queryObject, page, size }),
      getNodesCount(queryObject)
    ]).then(([nodesData, count]) => {
      setNodes(nodesData.data);
      setTotalNodes(count.data);

      if (ref.current !== null) {
        setDataReady(nodesData.success && count.success);
      }
    });
  };

  useEffect(fetchNodes, [searchLocation]);

  return (
    <div className='card position-unset' ref={ref}>
      <div className='card-header position-unset'>
        <NodesTabs />

        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <NodesFilters baseRoute={validatorsRoutes.queue} onlySearch />
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
        <PageState
          icon={faCogs}
          title='Unable to load nodes'
          className='py-spacer my-auto'
          dataTestId='errorScreen'
        />
      )}

      {dataReady === true && (
        <>
          <div className='card-body'>
            <NodesTable queue>
              <NodesTable.Body nodes={nodes} queue />
            </NodesTable>
          </div>
          <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
            <Pager total={totalNodes} show />
          </div>
        </>
      )}
    </div>
  );
};
