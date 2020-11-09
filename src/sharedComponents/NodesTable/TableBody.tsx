import * as React from 'react';
import { NodeType } from 'context/state';
import { truncate, urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, Led, PageState } from 'sharedComponents';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import RowIcon from './RowIcon';

const getRatings = (nodes: NodeType[]) => {
  return nodes.sort((a: any, b: any) => a.rating - b.rating).map((v: any) => v);
};

const NodesTable = ({ nodes }: { nodes: NodeType[] }) => {
  const orderedByRating = getRatings(nodes);

  return (
    <tbody>
      {orderedByRating.map((node, index) => (
        <tr key={node.publicKey}>
          <td>
            <div className="d-flex align-items-center">
              <RowIcon node={node} />
              {node.nodeType === 'validator' ? (
                <NetworkLink to={urlBuilder.nodeDetails(node.publicKey)}>
                  <Trim text={node.publicKey} />
                </NetworkLink>
              ) : (
                <Trim text={node.publicKey} />
              )}
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
          <td className="text-right">
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
            <div className="d-flex align-items-center justify-content-end">
              <Led color={node.status === 'online' ? 'bg-success' : 'bg-danger'} />
              <span className="ml-2">{node.status === 'online' ? 'Online' : 'Offline'}</span>
            </div>
          </td>
          <td className="text-right">{node.rating}</td>
        </tr>
      ))}
      {orderedByRating.length === 0 && (
        <tr>
          <td colSpan={7}>
            <PageState
              icon={faCogs}
              title="No Nodes"
              className="py-spacer my-auto"
              dataTestId="errorScreen"
            />
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default NodesTable;
