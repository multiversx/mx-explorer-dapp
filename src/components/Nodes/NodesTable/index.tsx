import * as React from 'react';
import { ValidatorType } from 'context/validators';
import { truncate, trimHash } from 'helpers';
import { ShardSpan, TestnetLink } from 'sharedComponents';
import RowIcon from './RowIcon';

const NodesTable = ({ nodes, ratingOrder }: { nodes: ValidatorType[]; ratingOrder: string[] }) => {
  console.log('render');

  return (
    <tbody>
      {nodes.map((node, index) => (
        <tr key={node.publicKey}>
          {/* <td>{node.nodeType === 'validator' ? ratingOrder.indexOf(node.publicKey) + 1 : ''}</td> */}
          <td>
            <RowIcon node={node} />
            <span>{trimHash(node.publicKey)}</span>
          </td>
          <td>
            {node.nodeDisplayName ? (
              truncate(node.nodeDisplayName, 20)
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </td>
          <td>
            <TestnetLink to={`/blocks/shards/${node.shardId}`} data-testid={`shardLink${index}`}>
              <ShardSpan shardId={node.shardId} />
            </TestnetLink>
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
