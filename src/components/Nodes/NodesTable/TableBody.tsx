import * as React from 'react';
import { ValidatorType } from 'context/validators';
import { truncate, urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim } from 'sharedComponents';
import RowIcon from './RowIcon';

const NodesTable = ({ nodes, ratingOrder }: { nodes: ValidatorType[]; ratingOrder: string[] }) => {
  return (
    <tbody>
      {nodes.map((node, index) => (
        <tr key={node.publicKey}>
          {/* <td>{node.nodeType === 'validator' ? ratingOrder.indexOf(node.publicKey) + 1 : ''}</td> */}
          <td>
            <div className="d-flex align-items-center">
              <RowIcon node={node} />
              <Trim text={node.publicKey} />
            </div>
          </td>
          <td>
            {node.nodeDisplayName ? (
              truncate(node.nodeDisplayName, 20)
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </td>
          <td>
            <NetworkLink to={urlBuilder.shard(node.shardId)} data-testid={`shardLink${index}`}>
              <ShardSpan shardId={node.shardId} />
            </NetworkLink>
          </td>

          <td>
            {node.versionNumber ? (
              truncate(node.versionNumber.split('-')[0], 20)
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </td>
          <td>
            {(node.totalUpTimeSec !== 0 || node.totalDownTimeSec !== 0) && (
              <span>
                {Math.floor(
                  (node.totalUpTimeSec * 100) / (node.totalUpTimeSec + node.totalDownTimeSec)
                )}
                %
              </span>
            )}
            {node.totalUpTimeSec === 0 &&
              node.totalDownTimeSec === 0 &&
              node.status === 'online' && <span>100%</span>}
            {node.totalUpTimeSec === 0 &&
              node.totalDownTimeSec === 0 &&
              node.status === 'offline' && <span>0%</span>}
          </td>
          <td>
            {node.status === 'online' ? (
              <div>
                <span className="badge badge-pill badge-success badge-status">&nbsp;</span>
                &nbsp;
                <span>Online</span>
              </div>
            ) : (
              <div>
                <span className="badge badge-pill badge-danger badge-status">&nbsp;</span>
                &nbsp;
                <span className={node.nodeType === 'observer' ? 'text-muted' : ''}>Offline</span>
              </div>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default NodesTable;
