import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, Loader, Pager, PageState } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import { NodesTable } from 'sharedComponents';
import { useFilters } from 'helpers';
import { useLocation, useParams } from 'react-router-dom';
import ProviderTabs from 'components/ProviderDetails/ProviderLayout/ProviderTabs';

const Nodes = () => {
  const ref = React.useRef(null);
  const { hash: address } = useParams() as any;
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

    Promise.all([
      getNodes({ ...queryObject, provider: address, size }),
      getNodesCount({ ...queryObject, provider: address }),
    ]).then(([nodesData, count]) => {
      dispatch({
        type: 'setNodes',
        nodes: nodesData.data,
      });
      setTotalNodes(count.data);

      if (ref.current !== null) {
        setDataReady(nodesData.success && count.success);
      }
    });
  };

  React.useEffect(fetchNodes, [search]);

  return (
    <div className="card" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex align-items-center">
          <ProviderTabs />
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
            <Pager itemsPerPage={25} page={String(size)} total={totalNodes} show />
          </div>
        </>
      )}
    </div>
  );
};

export default Nodes;
