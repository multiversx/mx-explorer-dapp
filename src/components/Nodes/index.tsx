import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, Loader, Pager, PageState } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import NodesTable from './NodesTable';
import Filters from './Filters';
import useFilters from './helpers/useFilters';
import { ValidatorType } from 'context/validators';
import tempShards from './tempShards';
import Tabs from 'components/Validators/Tabs';
import NodesLayout from 'sharedComponents/NodesLayout';
import { useLocation } from 'react-router-dom';

const Nodes = () => {
  const ref = React.useRef(null);
  const { search } = useLocation();
  const dispatch = useGlobalDispatch();
  const { getNodes, getNodesCount } = adapter();
  const { getQueryObject, size } = useFilters();
  const { nodes } = useGlobalState();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [ratingOrder, setRatingOrder] = React.useState<string[]>([]);

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

  const getRatings = () => {
    const uniqueRatings = nodes
      .filter((node: ValidatorType) => node.nodeType === 'validator')
      .sort((a: any, b: any) => a.rating - b.rating)
      .map((v: any) => v.publicKey);
    setRatingOrder(uniqueRatings);
  };

  React.useEffect(getRatings, [nodes]);

  return (
    <NodesLayout
      headerItem={
        <div className="card-header-item">
          <Filters
            // TODO: check results count if needed
            resultsCount={nodes.length}
          />
        </div>
      }
    >
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCogs}
          title="Unable to load validators"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
      <div ref={ref}>
        {dataReady === true && (
          <>
            {nodes.length > 0 ? (
              <>
                <div className="card-body p-0">
                  <NodesTable>
                    <thead>
                      <tr>
                        <th id="publickey">Public key</th>
                        <th id="nodeDisplayName">Node Name</th>
                        <th id="shardId">
                          <NodesTable.ShardLabel shardData={tempShards} />
                        </th>
                        <th id="versionNumber">Version</th>
                        <th id="totalUpTimeSec">Uptime</th>
                        <th id="isActive">
                          <NodesTable.StatusLabel />
                        </th>
                      </tr>
                    </thead>
                    <NodesTable.Body nodes={nodes} ratingOrder={ratingOrder} />
                  </NodesTable>
                </div>
                <div className="card-footer">
                  <Pager itemsPerPage={25} page={String(size)} total={totalNodes} show />
                </div>
              </>
            ) : (
              <PageState
                icon={faCogs}
                title="No Validators"
                className="py-spacer my-auto"
                dataTestId="errorScreen"
              />
            )}
          </>
        )}
      </div>
    </NodesLayout>
  );
};

export default Nodes;
