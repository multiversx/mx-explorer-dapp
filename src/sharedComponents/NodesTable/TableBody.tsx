import * as React from 'react';
import { NodeType } from 'context/state';
import { urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, Led, PageState } from 'sharedComponents';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import RowIcon from './RowIcon';

const NodesTable = ({ nodes }: { nodes: NodeType[] }) => {
  return (
    <tbody>
      {nodes.map((nodeData, index) => (
        <tr key={nodeData.bls}>
          <td>
            <div className="d-flex align-items-center">
              <RowIcon node={nodeData} />
              <NetworkLink to={urlBuilder.nodeDetails(nodeData.bls)} className="trim-wrapper">
                <Trim text={nodeData.bls} />
              </NetworkLink>
            </div>
          </td>
          <td>
            {nodeData.name ? (
              <div className="truncate-item-lg">{nodeData.name}</div>
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </td>
          <td>
            <div className="d-flex">
              {nodeData.shard !== undefined ? (
                <NetworkLink
                  to={urlBuilder.shard(nodeData.shard)}
                  data-testid={`shardLink${index}`}
                >
                  <ShardSpan shard={nodeData.shard} />
                </NetworkLink>
              ) : (
                <span className="text-secondary">N/A</span>
              )}
            </div>
          </td>

          <td>
            {nodeData.version ? nodeData.version : <span className="text-secondary">N/A</span>}
          </td>
          <td className="text-right">
            {nodeData.uptimeSec !== undefined && nodeData.uptimeSec !== 0 ? (
              <span>{nodeData.uptime}%</span>
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </td>
          <td>
            <div className="d-flex align-items-center justify-content-end">
              <Led color={nodeData.online ? 'bg-success' : 'bg-danger'} />
              <span className={`ml-2 ${nodeData.online ? 'text-success' : 'text-danger'}`}>
                {nodeData.online ? 'online' : 'offline'}
              </span>
            </div>
          </td>
          <td className="text-right">
            {!isNaN(nodeData.tempRating) ? (
              Math.floor(nodeData.tempRating)
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </td>
        </tr>
      ))}
      {nodes.length === 0 && (
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
