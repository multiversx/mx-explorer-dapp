import * as React from 'react';
import { NodeType } from 'context/state';
import { urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, Led, PageState } from 'sharedComponents';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import RowIcon from './RowIcon';

const getRatings = (nodes: NodeType[]) => {
  return nodes.sort((a: any, b: any) => b.tempRating - a.tempRating).map((v: any) => v);
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
                <NetworkLink to={urlBuilder.nodeDetails(node.publicKey)} className="trim-wrapper">
                  <Trim text={node.publicKey} />
                </NetworkLink>
              ) : (
                <Trim text={node.publicKey} />
              )}
            </div>
          </td>
          <td>
            {node.nodeName ? (
              <Trim text={node.nodeName} />
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </td>
          <td>
            <div className="d-flex">
              <NetworkLink to={urlBuilder.shard(node.shard)} data-testid={`shardLink${index}`}>
                <ShardSpan shard={node.shard} />
              </NetworkLink>
            </div>
          </td>

          <td>
            {node.versionNumber ? node.versionNumber : <span className="text-secondary">N/A</span>}
          </td>
          <td className="text-right">
            {node.totalUpTimeSec !== 0 && <span>{node.totalUpTime}%</span>}
            {node.totalUpTime === 0 && node.status === 'online' && <span>100%</span>}
            {node.totalUpTime === 0 && node.totalDownTime === 0 && node.status === 'offline' && (
              <span>0%</span>
            )}
          </td>
          <td>
            <div className="d-flex align-items-center justify-content-end">
              <Led color={node.status === 'online' ? 'bg-success' : 'bg-danger'} />
              <span className="ml-2">{node.status === 'online' ? 'Online' : 'Offline'}</span>
            </div>
          </td>
          <td className="text-right">
            {!isNaN(node.tempRating) ? (
              Math.floor(node.tempRating)
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </td>
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
