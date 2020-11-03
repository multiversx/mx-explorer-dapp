import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, Loader, PageState } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import NodesTable from './NodesTable';
import Filters from './Filters';
import nodesIssues from './helpers/nodesIssues';
import useFilters, { FiltersType } from './helpers/useFilters';
import { ValidatorType } from 'context/validators';
import tempNodes from './tempNodes';
import tempShards from './tempShards';

const Nodes = () => {
  const ref = React.useRef(null);
  const dispatch = useGlobalDispatch();
  const { getNetworkConfig, getNodes } = adapter();
  const {
    setUrlQueryParams,
    searchValue: urlSearchValue,
    peerType: ulrPeerType,
    issues: ulrIssues,
    shard: ulrShard,
    status: ulrStatus,
  } = useFilters();
  const { nodes, versionNumber } = useGlobalState();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [ratingOrder, setRatingOrder] = React.useState<string[]>([]);

  const [shard, setShard] = React.useState<FiltersType['shard']>('');
  const [status, setStatus] = React.useState<FiltersType['status']>('');
  const [searchValue, setSearchValue] = React.useState<FiltersType['searchValue']>('');
  const [peerType, setPeerType] = React.useState<FiltersType['peerType']>('');
  const [issues, setIssues] = React.useState<FiltersType['issues']>(false);

  React.useEffect(() => {
    if (ulrShard !== undefined) {
      setShard(ulrShard);
    }
    if (urlSearchValue) {
      setSearchValue(urlSearchValue);
    }
    if (ulrPeerType) {
      setPeerType(ulrPeerType);
    }
    if (ulrStatus) {
      setStatus(ulrStatus);
    }
    if (ulrIssues) {
      setIssues(Boolean(ulrIssues));
    }
  }, [urlSearchValue, ulrPeerType, ulrIssues, ulrShard, ulrStatus]);

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
      setUrlQueryParams({ issues, peerType, searchValue, shard, status });

      setDataReady(undefined);

      const nodes = tempNodes.map((node: any) => {
        return {
          ...node,
          ...(node.nodeType !== 'observer'
            ? {
                issue: nodesIssues({
                  node,
                  versionNumber,
                }),
              }
            : { issue: '' }),
          nodeDisplayName: node.nodeDisplayName ? node.nodeDisplayName : node.publicKey,
        };
      });
      dispatch({
        type: 'setNodes',
        nodes,
      });
      setDataReady(true);

      // getNodes(query)
      //   .then(({ data }) => {
      //     const nodes = data.map((node: ValidatorType) => {
      //       return {
      //         ...node,
      //         ...(node.nodeType !== 'observer'
      //           ? {
      //               issue: nodesIssues({
      //                 node,
      //                 versionNumber,
      //               }),
      //             }
      //           : { issue: '' }),
      //         nodeDisplayName: node.nodeDisplayName ? node.nodeDisplayName : node.publicKey,
      //       };
      //     });
      //     dispatch({
      //       type: 'setNodes',
      //       nodes,
      //     });
      //     if (ref.current !== null) {
      //       setDataReady(true);
      //     }
      //   })
      //   .catch((error) => {
      //     if (ref.current !== null) {
      //       setDataReady(false);
      //     }
      //   });
    }
  };

  React.useEffect(fetchNodes, [versionNumber, issues, peerType, searchValue, shard, status]);

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
                  {nodes.length > 0 ? (
                    <>
                      <div className="card-header">
                        <div className="card-header-item">
                          <Filters
                            resultsCount={nodes.length}
                            setSearchValue={setSearchValue}
                            setPeerType={setPeerType}
                            setIssues={setIssues}
                            searchValue={searchValue}
                            peerType={peerType}
                            issues={issues}
                          />
                        </div>
                      </div>
                      <div className="card-body p-0">
                        <NodesTable>
                          <thead>
                            <tr>
                              <th id="publickey">Public key</th>
                              <th id="nodeDisplayName">Node Name</th>
                              <th id="shardId">
                                <NodesTable.ShardLabel
                                  shardData={tempShards}
                                  setShard={setShard}
                                  shard={shard}
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
