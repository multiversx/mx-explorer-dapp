import {
  NodeRating,
  NodeStatus,
  NetworkLink,
  Trim,
  NodeChangingShardIcon,
  NodeIssueIcon,
  NodeFullHistoryIcon,
  NodeLockedStake,
  NodeQualification,
  NodeOnlineIcon,
  SharedIdentity,
  ShardLink
} from 'components';
import { formatBigNumber, urlBuilder } from 'helpers';
import { NodeStatusEnum, NodeType, NodeTypeEnum } from 'types';

export interface StandardRowUIType {
  nodeData: NodeType;
  index: number;
  type?: NodeType['type'];
  status?: NodeType['status'];
  showThresholdRow?: boolean;
  showPosition?: boolean;
}

export const StandardRow = ({
  nodeData,
  index,
  type,
  status
}: StandardRowUIType) => {
  return (
    <tr>
      <td>
        <div className='d-flex align-items-center gap-1 hash hash-lg'>
          {status === NodeStatusEnum.queued && (
            <>
              {nodeData.position ? (
                nodeData.position
              ) : (
                <span className='text-neutral-400'>N/A</span>
              )}
            </>
          )}
          <NodeOnlineIcon node={nodeData} className='ms-1 me-2' />
          <NetworkLink to={urlBuilder.nodeDetails(nodeData.bls)}>
            <SharedIdentity.Avatar
              identity={nodeData.identityInfo}
              className='identity-avatar-md me-1'
              showTooltip
            />
          </NetworkLink>
          <NetworkLink
            to={urlBuilder.nodeDetails(nodeData.bls)}
            className='trim-wrapper'
          >
            <Trim text={nodeData.bls} />
          </NetworkLink>
          <NodeChangingShardIcon node={nodeData} />
          <NodeFullHistoryIcon node={nodeData} small={true} />
          <NodeIssueIcon node={nodeData} />
        </div>
      </td>
      <td>
        {nodeData.name ? (
          <div className='truncate-item-lg' title={nodeData.name}>
            {nodeData.name}
          </div>
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td>
        <div className='d-flex'>
          <ShardLink data-testid={`shardLink${index}`} shard={nodeData.shard} />
        </div>
      </td>
      <td>
        {nodeData.version ? (
          nodeData.version
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      {type !== NodeTypeEnum.observer && (
        <td>
          <NodeStatus node={nodeData} />
        </td>
      )}
      {status === NodeStatusEnum.auction && (
        <td>
          <NodeQualification node={nodeData} />
        </td>
      )}
      {(type === NodeTypeEnum.validator ||
        status === NodeStatusEnum.auction) && (
        <td>
          <NodeLockedStake node={nodeData} />
        </td>
      )}
      {type !== NodeTypeEnum.observer && (
        <>
          {status !== NodeStatusEnum.auction && (
            <td style={{ maxWidth: '8rem' }}>
              {nodeData.validatorIgnoredSignatures ? (
                formatBigNumber({ value: nodeData.validatorIgnoredSignatures })
              ) : (
                <span className='text-neutral-400'>N/A</span>
              )}
            </td>
          )}
          <td>
            <NodeRating node={nodeData} />
          </td>
        </>
      )}
      <td className='text-end'>
        {nodeData.nonce ? (
          nodeData.nonce
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
    </tr>
  );
};
