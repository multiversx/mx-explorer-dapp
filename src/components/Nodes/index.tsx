import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { adapter, Loader, NodesTabs } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from 'context';
import NodesTable from './NodesTable';
import Filters from './Filters';
import { nodesIssues, useFilters } from './helpers';
import { ValidatorType } from 'context/validators';
import tempNodes from './tempNodes';

export type DirectioinsType = 'none' | 'desc' | 'asc';

interface HeadersType {
  id: string;
  label: string;
  dir: DirectioinsType;
}

const headers: HeadersType[] = [
  {
    id: 'publicKey',
    label: 'Public Key',
    dir: 'none',
  },
  {
    id: 'nodeDisplayName',
    label: 'Node Name',
    dir: 'none',
  },
  {
    id: 'shardId',
    label: 'Shard',
    dir: 'none',
  },
  {
    id: 'versionNumber',
    label: 'Version',
    dir: 'none',
  },

  {
    id: 'totalUpTimeSec',
    label: 'Uptime',
    dir: 'none',
  },
  {
    id: 'isActive',
    label: 'Status',
    dir: 'none',
  },
];

const Nodes = () => {
  const ref = React.useRef(null);
  const dispatch = useGlobalDispatch();
  const { getNetworkConfig, getNodes } = adapter();
  const {
    getQueryParams,
    searchValue: urlSearchValue,
    peerType: ulrPeerType,
    issues: ulrIssues,
  } = useFilters();
  const { nodes, versionNumber } = useGlobalState();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [ratingOrder, setRatingOrder] = React.useState<string[]>([]);

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [peerType, setPeerType] = React.useState<string | undefined>();
  const [issues, setIssues] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (urlSearchValue) {
      setSearchValue(urlSearchValue);
    }
    if (ulrPeerType) {
      setPeerType(ulrPeerType);
    }
    if (ulrIssues) {
      setIssues(Boolean(ulrIssues));
    }
  }, [urlSearchValue, ulrPeerType, ulrIssues]);

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

  console.log('\x1b[42m%s\x1b[0m', 11);

  const fetchNodes = () => {
    if (versionNumber) {
      // const query = getQueryParams({ issues, peerType, searchValue });
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

  React.useEffect(fetchNodes, [versionNumber, issues, peerType, searchValue]);

  const getRatings = () => {
    const uniqueRatings = nodes
      .filter((node: ValidatorType) => node.nodeType === 'validator')
      .sort((a: any, b: any) => a.rating - b.rating)
      .map((v: any) => v.publicKey);
    setRatingOrder(uniqueRatings);
  };

  React.useEffect(getRatings, [nodes]);

  return (
    <div ref={ref}>
      {(dataReady === undefined || !versionNumber) && <Loader />}
      {dataReady === true && (
        <div className="container pt-3 pb-3">
          <div className="row">
            <div className="col-12">
              <h4>
                <span data-testid="title">Nodes</span>
              </h4>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card card-small">
                <div className="card-body p-0">
                  <NodesTabs />
                  <Filters
                    resultsCount={nodes.length}
                    setSearchValue={setSearchValue}
                    setPeerType={setPeerType}
                    setIssues={setIssues}
                    searchValue={searchValue}
                    peerType={peerType}
                    issues={issues}
                  />
                  <div className="table-wrapper fixed-width-sm">
                    <table className="table m-0" data-testid="nodesTable">
                      <thead>
                        <tr>
                          {/* <th>#</th> */}
                          {headers.map((header) => (
                            <th key={header.id}>{header.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <NodesTable nodes={nodes} ratingOrder={ratingOrder} />
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {dataReady === false && (
        <div className="card">
          <div className="card-body card-details" data-testid="errorScreen">
            <div className="empty">
              <FontAwesomeIcon icon={faCogs} className="empty-icon" />
              <span className="h4 empty-heading">Unable to load validators</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nodes;
