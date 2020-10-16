import React from 'react';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { adapter, Loader } from 'sharedComponents';
import NodesTable from './NodesTable';
import { nodesIssues } from './helpers';
import { ValidatorType } from 'context/validators';

export type DirectioinsType = 'none' | 'desc' | 'asc';

interface HeadersType {
  id: string;
  label: string;
  dir: DirectioinsType;
}

// "publicKey": "0059c1e7b6e78e081c659e3c5c5b1802f825583e819117674940f5826a5648e11d2f234e0677b18d83de403b8f15fd1053dc2b724d996210c9d6bd993322eaf4cb42756f19e34f93f62be31d685889727cba63365997ab7a2f0ddc9045418384",
// "nodeDisplayName": "Elrond-Bootnode-31-1",
// "versionNumber": "v1.1.0.1-0-g2bb866e15/go1.14.2/linux-amd64/f6a2e53ea3",
// "identity": "elrondcom",
// "rating": 100,
// "totalUpTimeSec": 6651045,
// "totalDownTimeSec": 328,
// "shardId": 2,
// "nodeType": "validator",
// "peerType": "eligible",
// "isActive": true

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
  const { getNodes, getNetworkConfig } = adapter();
  const [nodes, setNodes] = React.useState([]);
  const [success, setSuccess] = React.useState<boolean | undefined>(undefined);

  const [ratingOrder, setRatingOrder] = React.useState<string[]>([]);

  const fetchNodes = () => {
    Promise.all([getNodes(), getNetworkConfig()])
      .then(([nodesData, config]) => {
        const processedNodes = nodesData.data.map((node: ValidatorType) => {
          return {
            ...node,
            ...(node.nodeType !== 'observer'
              ? {
                  issue: nodesIssues({
                    node,
                    versionNumber: config.erd_latest_tag_software_version,
                    nrOfShards: config.erd_num_shards_without_meta,
                  }),
                }
              : { issue: '' }),
            nodeDisplayName: node.nodeDisplayName ? node.nodeDisplayName : node.publicKey,
          };
        });
        setNodes(processedNodes);
        setSuccess(true);
      })
      .catch(() => {
        setSuccess(false);
      });
  };

  const getRatings = () => {
    const uniqueRatings = nodes
      .filter((node: ValidatorType) => node.nodeType === 'validator')
      .sort((a: any, b: any) => a.rating - b.rating)
      .map((v: any) => v.publicKey);
    setRatingOrder(uniqueRatings);
  };

  React.useEffect(getRatings, [nodes]);

  React.useEffect(fetchNodes, []);

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4>
              <span data-testid="title">Nodes</span>
            </h4>
          </div>
        </div>
        {success === undefined && <Loader />}
        {success === true && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body card-list">
                  <p className="mb-0">Showing {nodes.length.toLocaleString('en')} nodes</p>
                  <div className="table-responsive">
                    <table className="table mt-3">
                      <thead>
                        <tr>
                          <th>#</th>
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
        )}
        {success === false && (
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
    </div>
  );
};

export default Nodes;
