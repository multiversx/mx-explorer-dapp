import * as React from 'react';
import { NodeType } from 'context/state';
import { urlBuilder } from 'helpers';
import { NetworkLink, Trim, Led } from 'sharedComponents';
import RowIcon from '../../RowIcon';

const QueueRow = ({ nodeData }: { nodeData: NodeType }) => {
  return (
    <>
      <td>
        {nodeData.position ? (
          <div className="truncate-item-lg">{nodeData.position.toLocaleString('en')}</div>
        ) : (
          <span className="text-secondary">N/A</span>
        )}
      </td>
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
      <td>{nodeData.version ? nodeData.version : <span className="text-secondary">N/A</span>}</td>
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
    </>
  );
};

export default QueueRow;
