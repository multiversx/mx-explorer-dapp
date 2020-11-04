import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, Loader, Pager, PageState } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import NodesTable from './NodesTable';
import Filters from './Filters';
import useFilters, { FiltersType } from './helpers/useFilters';
import { ValidatorType } from 'context/validators';
import tempShards from './tempShards';
import Tabs from 'components/Validators/Tabs';

const Nodes = () => {
  const ref = React.useRef(null);
  const dispatch = useGlobalDispatch();
  const { getNetworkConfig, getNodes } = adapter();
  const {
    getQueryString,
    search: urlSearch,
    peerType: ulrPeerType,
    nodeType: ulrNodeType,
    issues: ulrIssues,
    shardId: ulrShardId,
    page: ulrPage,
    status: ulrStatus,
  } = useFilters();
  const { nodes, versionNumber } = useGlobalState();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [ratingOrder, setRatingOrder] = React.useState<string[]>([]);

  const [shardId, setShardId] = React.useState<FiltersType['shardId']>('');
  const [page, setPage] = React.useState<FiltersType['page']>('');
  const [status, setStatus] = React.useState<FiltersType['status']>('');
  const [search, setSearch] = React.useState<FiltersType['search']>('');
  const [peerType, setPeerType] = React.useState<FiltersType['peerType']>('');
  const [nodeType, setNodeType] = React.useState<FiltersType['nodeType']>('');
  const [issues, setIssues] = React.useState<FiltersType['issues']>(false);

  React.useEffect(() => {
    if (ulrShardId !== undefined) {
      setShardId(ulrShardId);
    }
    if (urlSearch) {
      setSearch(urlSearch);
    }
    if (ulrPeerType) {
      setPeerType(ulrPeerType);
    }
    if (ulrNodeType) {
      setNodeType(ulrNodeType);
    }
    if (ulrPage) {
      setPage(ulrPage);
    }
    if (ulrStatus) {
      setStatus(ulrStatus);
    }
    if (ulrIssues) {
      setIssues(Boolean(ulrIssues));
    }
  }, [urlSearch, ulrPeerType, ulrIssues, ulrStatus, ulrPage, ulrNodeType, ulrShardId]);

  const getVersionNumber = () => {
    if (nodes.length === 0) {
      getNetworkConfig().then((config) => {
        dispatch({
          type: 'setVersionNumber',
          versionNumber: config.erd_latest_tag_software_version,
        });
      });
    }
  };

  React.useEffect(getVersionNumber, []);

  const fetchNodes = () => {
    if (versionNumber) {
      const { queryObject, query, updatePushState } = getQueryString({
        issues,
        peerType,
        search,
        nodeType,
        shardId,
        status,
        page,
      });

      if (updatePushState) {
        window.history.pushState({}, '', `/nodes${query}`);
      }

      setDataReady(undefined);
      getNodes(queryObject)
        .then(({ data: nodes }) => {
          dispatch({
            type: 'setNodes',
            nodes,
          });
          if (ref.current !== null) {
            setDataReady(true);
          }
        })
        .catch((error) => {
          if (ref.current !== null) {
            setDataReady(false);
          }
        });
    }
  };

  React.useEffect(fetchNodes, [
    versionNumber,
    issues,
    peerType,
    search,
    shardId,
    status,
    page,
    nodeType,
  ]);

  const getRatings = () => {
    const uniqueRatings = nodes
      .filter((node: ValidatorType) => node.nodeType === 'validator')
      .sort((a: any, b: any) => a.rating - b.rating)
      .map((v: any) => v.publicKey);
    setRatingOrder(uniqueRatings);
  };

  React.useEffect(getRatings, [nodes]);

  return (
    <>
      {(!versionNumber || dataReady === undefined) && <Loader />}
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
          <div className="container py-spacer">
            <div className="row page-header mb-spacer">
              <div className="col-12">
                <h3 className="page-title">
                  <span data-testid="title">Nodes</span>
                </h3>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-item pb-0 px-0 border-0">
                      <Tabs />
                    </div>
                    {nodes.length > 0 && (
                      <div className="card-header-item">
                        <Filters
                          resultsCount={nodes.length}
                          setSearch={setSearch}
                          setPeerType={setPeerType}
                          peerType={peerType}
                          setNodeType={setNodeType}
                          nodeType={nodeType}
                          setIssues={setIssues}
                          search={search}
                          issues={issues}
                        />
                      </div>
                    )}
                  </div>
                  {nodes.length > 0 ? (
                    <>
                      <div className="card-body p-0">
                        <NodesTable>
                          <thead>
                            <tr>
                              <th id="publickey">Public key</th>
                              <th id="nodeDisplayName">Node Name</th>
                              <th id="shardId">
                                <NodesTable.ShardLabel
                                  shardData={tempShards}
                                  setShardId={setShardId}
                                  shardId={shardId}
                                />
                              </th>
                              <th id="versionNumber">Version</th>
                              <th id="totalUpTimeSec">Uptime</th>
                              <th id="isActive">
                                <NodesTable.StatusLabel setStatus={setStatus} status={status} />
                              </th>
                            </tr>
                          </thead>
                          <NodesTable.Body nodes={nodes} ratingOrder={ratingOrder} />
                        </NodesTable>
                      </div>
                      <div className="card-footer">
                        <Pager itemsPerPage={50} page={'1'} total={1000} show={true} />
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Nodes;
