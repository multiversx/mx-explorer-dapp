import {
  NodeRating,
  NodeStatus,
  ShardSpan,
  NetworkLink,
  Trim,
  Overlay,
  FormatAmount,
  NodeChangingShardIcon,
  NodeIssueIcon,
  NodeFullHistoryIcon,
  NodeLockedStakeTooltip,
  NodeQualification,
  NodeOnlineIcon
} from 'components';
import { formatBigNumber, urlBuilder } from 'helpers';
import { NodeType } from 'types';

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
      {status === 'queued' && (
        <td>
          {nodeData.position ? (
            <div>{nodeData.position}</div>
          ) : (
            <span className='text-neutral-400'>N/A</span>
          )}
        </td>
      )}
      <td>
        <div className='d-flex align-items-center gap-1 hash'>
          <NodeOnlineIcon node={nodeData} />
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
      {status !== 'auction' && (
        <td style={{ maxWidth: '8rem' }}>
          {nodeData.validatorIgnoredSignatures ? (
            formatBigNumber({ value: nodeData.validatorIgnoredSignatures })
          ) : (
            <span className='text-neutral-400'>N/A</span>
          )}
        </td>
      )}
      <td>
        <NodeStatus node={nodeData} />
      </td>
      {status === 'auction' && (
        <td>
          <NodeQualification
            node={nodeData}
            showDangerZone={true}
            className='justify-content-end'
          />
        </td>
      )}
      {(type === 'validator' || status === 'auction') && nodeData.locked && (
        <td>
          {status !== 'auction' || nodeData.auctionQualified ? (
            <Overlay
              title={
                <NodeLockedStakeTooltip
                  node={nodeData}
                  showAuctionTopup={status === 'auction'}
                />
              }
              tooltipClassName='tooltip-text-start tooltip-lg'
              truncate
            >
              <FormatAmount value={nodeData.locked} showTooltip={false} />
            </Overlay>
          ) : (
            <FormatAmount value={nodeData.locked} />
          )}
        </td>
      )}
      <td>
        <NodeRating node={nodeData} />
      </td>
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
