import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, Loader, Pager, PageState } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import { NodesTable } from 'sharedComponents';
import Filters from './Filters';
import { useFilters } from 'helpers';
import NodesLayout from 'sharedComponents/NodesLayout';
import { useLocation } from 'react-router-dom';
import NodeTabs from 'sharedComponents/NodesLayout/NodeTabs';

const Nodes = () => {
  const ref = React.useRef(null);
  const { search } = useLocation();
  const dispatch = useGlobalDispatch();
  const { getNodes, getNodesCount } = adapter();
  const { getQueryObject, size } = useFilters();
  const { nodes } = useGlobalState();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalNodes, setTotalNodes] = React.useState<number | '...'>('...');

  const fetchNodes = () => {
    const queryObject = getQueryObject();

    setDataReady(undefined);

    Promise.all([getNodes({ ...queryObject, size }), getNodesCount(queryObject)]).then(
      ([nodesData, count]) => {
        dispatch({
          type: 'setNodes',
          nodes: nodesData.data,
        });
        setTotalNodes(count.data);

        if (ref.current !== null) {
          setDataReady(nodesData.success && count.success);
        }
      }
    );
  };

  React.useEffect(fetchNodes, [search]);

  return (
    <div ref={ref}>
      <NodesLayout>
        <div className="card">
          <div className="card-header">
            <NodeTabs />

            <div className="card-header-item">
              <Filters
                // TODO: check results count if needed
                resultsCount={nodes.length}
              />
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
          {dataReady === true && nodes.length === 0 && (
            <PageState
              icon={faCogs}
              title="No Nodes"
              className="py-spacer my-auto"
              dataTestId="errorScreen"
            />
          )}

          {dataReady === true && nodes.length > 0 && (
            <>
              <div className="card-body p-0">
                <NodesTable>
                  <NodesTable.Body nodes={nodes} />
                </NodesTable>
              </div>
              <div className="card-footer">
                <Pager itemsPerPage={25} page={String(size)} total={totalNodes} show />
              </div>
            </>
          )}
        </div>
      </NodesLayout>
    </div>
  );
};

export default Nodes;
