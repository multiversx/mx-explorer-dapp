import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { useLocation } from 'react-router-dom';
import { adapter, Loader, Pager, PageState, NodesTable, NodesFilters } from 'sharedComponents';
import { validatorsRoutes } from 'routes';
import { useFilters } from 'helpers';
import { NodeType } from 'helpers/types';
import NodesTabs from 'components/Nodes/NodesLayout/NodesTabs';

const NodesStatistics = () => {
  const ref = React.useRef(null);
  const { search } = useLocation();
  const { getNodes, getNodesCount } = adapter();
  const { getQueryObject, size } = useFilters();
  const [nodes, setNodes] = React.useState<NodeType[]>([]);
  const [totalNodes, setTotalNodes] = React.useState<number | '...'>('...');
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const queryParams = getQueryObject();
  if (!queryParams.sort) {
    queryParams.sort = 'position';
    queryParams.order = 'asc';
  }

  const fetchNodes = () => {
    const queryObject = {
      ...queryParams,
      type: 'validator',
      status: 'queued',
    };
    setDataReady(undefined);

    Promise.all([getNodes({ ...queryObject, size }), getNodesCount(queryObject)]).then(
      ([nodesData, count]) => {
        setNodes(nodesData.data);
        setTotalNodes(count.data);

        if (ref.current !== null) {
          setDataReady(nodesData.success && count.success);
        }
      }
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchNodes, [search]);

  return (
    <div className="card position-unset" ref={ref}>
      <div className="card-header position-unset">
        <NodesTabs />

        <div className="card-header-item d-flex justify-content-between align-items-center">
          <NodesFilters baseRoute={validatorsRoutes.queue} onlySearch />
          {dataReady === true && (
            <div className="d-none d-sm-flex">
              <Pager itemsPerPage={25} page={String(size)} total={totalNodes} show />
            </div>
          )}
        </div>
      </div>

      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCogs}
          title="Unable to load nodes"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}

      {dataReady === true && (
        <>
          <div className="card-body p-0">
            <NodesTable queue>
              <NodesTable.Body nodes={nodes} queue />
            </NodesTable>
          </div>
          <div className="card-footer d-flex justify-content-end">
            <Pager itemsPerPage={25} page={String(size)} total={totalNodes} show />
          </div>
        </>
      )}
    </div>
  );
};

export default NodesStatistics;
