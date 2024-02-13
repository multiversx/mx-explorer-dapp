import {
  NodeRating,
  NodeStatus,
  ShardSpan,
  NetworkLink,
  Trim,
  Overlay,
  Denominate,
  NodeStatusIcon,
  NodeIssueIcon,
  NodeFullHistoryIcon,
  NodeLockedStakeTooltip
} from 'components';
import { urlBuilder } from 'helpers';
import { NodeType } from 'types';

export const StandardRow = ({
  nodeData,
  index,
  type,
  status
}: {
  nodeData: NodeType;
  index: number;
  type?: NodeType['type'];
  status?: NodeType['status'];
}) => {
  return (
    <tr>
      <td>
        <div className='d-flex align-items-center gap-1 hash'>
          <NodeStatusIcon node={nodeData} />
          <NodeFullHistoryIcon node={nodeData} small={true} />
          <NetworkLink
            to={urlBuilder.nodeDetails(nodeData.bls)}
            className='trim-wrapper'
          >
            <Trim text={nodeData.bls} />
          </NetworkLink>
          <NodeIssueIcon node={nodeData} />
        </div>
      </td>
      <td>
        {nodeData.name ? (
          <div className='truncate-item-lg'>{nodeData.name}</div>
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td>
        <div className='d-flex'>
          {nodeData.shard !== undefined ? (
            <NetworkLink
              to={urlBuilder.shard(nodeData.shard)}
              data-testid={`shardLink${index}`}
            >
              <ShardSpan shard={nodeData.shard} />
            </NetworkLink>
          ) : (
            <span className='text-neutral-400'>N/A</span>
          )}
        </div>
      </td>
      <td>
        {nodeData.version ? (
          nodeData.version
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td className='text-end' style={{ maxWidth: '8rem' }}>
        {nodeData.validatorIgnoredSignatures ? (
          nodeData.validatorIgnoredSignatures.toLocaleString('en')
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td>
        <NodeStatus node={nodeData} className='align-items-end' />
      </td>
      <td className='text-end'>
        <NodeRating node={nodeData} className='justify-content-end' />
      </td>
      <td className='text-end'>
        {nodeData.nonce ? (
          nodeData.nonce
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>

      {status === 'queued' && (
        <td className='text-end'>
          {nodeData.position ? (
            <div className='truncate-item-lg'>{nodeData.position}</div>
          ) : (
            <span className='text-neutral-400'>N/A</span>
          )}
        </td>
      )}

      {type === 'validator' && nodeData.locked && (
        <td className='text-end'>
          <Overlay title={<NodeLockedStakeTooltip node={nodeData} />}>
            <Denominate value={nodeData.locked} showTooltip={false} />
          </Overlay>
        </td>
      )}
    </tr>
  );
};
