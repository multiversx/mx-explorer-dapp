import React, { useEffect, useRef, useState } from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { useSearchParams } from 'react-router-dom';
import {
  useAdapter,
  Loader,
  Pager,
  PageState,
  NodesTable,
  NodesFilters
} from 'components';
import { useGetFilters } from 'hooks';
import { NodesTabs } from 'pages/Nodes/NodesLayout/NodesTabs';
import { validatorsRoutes } from 'routes';
import { NodeType } from 'types';

export const Nodes = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { getNodes, getNodesCount } = useAdapter();
  const { getQueryObject, size } = useGetFilters();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [totalNodes, setTotalNodes] = useState<number | '...'>('...');
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const { type, status } = Object.fromEntries(searchParams);

  const fetchNodes = () => {
    const queryObject = getQueryObject();
    setDataReady(undefined);

    Promise.all([
      getNodes({ ...queryObject, size }),
      getNodesCount(queryObject)
    ]).then(([nodesData, count]) => {
      setNodes(nodesData.data);
      setTotalNodes(count.data);

      if (ref.current !== null) {
        setDataReady(nodesData.success && count.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchNodes, [searchParams]);

  return (
    <div className='card position-unset' ref={ref}>
      <div className='card-header position-unset'>
        <NodesTabs />

        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
          <NodesFilters baseRoute={validatorsRoutes.nodes} />
          {dataReady === true && (
            <Pager
              itemsPerPage={25}
              page={String(size)}
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
            <NodesTable
              type={type as NodeType['type']}
              status={status as NodeType['status']}
            >
              <NodesTable.Body
                nodes={nodes}
                type={type as NodeType['type']}
                status={status as NodeType['status']}
              />
            </NodesTable>
          </div>
          <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
            <Pager
              itemsPerPage={25}
              page={String(size)}
              total={totalNodes}
              show
            />
          </div>
        </>
      )}
    </div>
  );
};
