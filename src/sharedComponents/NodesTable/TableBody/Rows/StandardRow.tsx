import * as React from 'react';
import { urlBuilder } from 'helpers';
import { NodeType } from 'helpers/types';
import { ShardSpan, NetworkLink, Trim, Led, Overlay, Denominate } from 'sharedComponents';
import RowIcon from 'sharedComponents/NodesTable/RowIcon';
import RowIssueIcon from 'sharedComponents/NodesTable/RowIssueIcon';
import RowFullHistory from 'sharedComponents/NodesTable/RowFullHistory';

const StandardRow = ({
  nodeData,
  index,
  type,
}: {
  nodeData: NodeType;
  index: number;
  type?: NodeType['type'];
}) => {
  const ValidatorLockedStakeTooltip = () => {
    if ((type === 'validator' && nodeData.locked && nodeData.stake) || nodeData.topUp) {
      return (
        <>
          {nodeData.stake && (
            <div>
              Staked: <Denominate value={nodeData.stake} showTooltip={false} />
            </div>
          )}
          {nodeData.topUp && (
            <div>
              Top up: <Denominate value={nodeData.topUp} showTooltip={false} />
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <>
      <td>
        <div className="d-flex align-items-center">
          <RowIcon node={nodeData} />
          <RowFullHistory node={nodeData} small={true} />
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

      {type === 'validator' && nodeData.locked && (
        <td className="text-right">
          <Overlay title={<ValidatorLockedStakeTooltip />}>
            <Denominate value={nodeData.locked} showTooltip={false} />
          </Overlay>
        </td>
      )}
    </>
  );
};

export default StandardRow;
