import * as React from 'react';
import { NodeType } from 'context/state';
import { urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, Led } from 'sharedComponents';
import RowIcon from 'sharedComponents/NodesTable/RowIcon';
import RowIssueIcon from 'sharedComponents/NodesTable/RowIssueIcon';

const StandardRow = ({ nodeData, index }: { nodeData: NodeType; index: number }) => {
  return (
    <>
      <td>
        <div className="d-flex align-items-center">
          <RowIcon node={nodeData} />
          <NetworkLink to={urlBuilder.nodeDetails(nodeData.bls)} className="trim-wrapper">
            <Trim text={nodeData.bls} />
          </NetworkLink>
          <RowIssueIcon node={nodeData} />
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
            <NetworkLink to={urlBuilder.shard(nodeData.shard)} data-testid={`shardLink${index}`}>
              <ShardSpan shard={nodeData.shard} />
            </NetworkLink>
          ) : (
            <span className="text-secondary">N/A</span>
          )}
        </div>
      </td>
      <td>{nodeData.version ? nodeData.version : <span className="text-secondary">N/A</span>}</td>
      <td className="text-right" style={{ maxWidth: '8rem' }}>
        {nodeData.validatorIgnoredSignatures ? (
          nodeData.validatorIgnoredSignatures.toLocaleString('en')
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
    </>
  );
};

export default StandardRow;
