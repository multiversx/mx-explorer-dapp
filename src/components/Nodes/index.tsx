import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, Loader, Pager, PageState } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import { NodesTable } from 'sharedComponents';
import Filters from './Filters';
import { useFilters, useIsMainnet } from 'helpers';
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
  const isMainnet = useIsMainnet();

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
    <div className="d-flex flex-column flex-fill" ref={ref}>
      <NodesLayout>
        <div className="card" ref={ref}>
          <div className="card-header">
            {isMainnet && (
              <NodeTabs>
                <Pager itemsPerPage={25} page={String(size)} total={totalNodes} show />
              </NodeTabs>
            )}

            <div className="card-header-item">
              <Filters />
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
                <NodesTable>
                  <NodesTable.Body nodes={nodes} />
                </NodesTable>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <Pager
                  className="my-3"
                  itemsPerPage={25}
                  page={String(size)}
                  total={totalNodes}
                  show
                />
              </div>
            </>
          )}
        </div>
      </NodesLayout>
    </div>
  );
};

export default Nodes;
