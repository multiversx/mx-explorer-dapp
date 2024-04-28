import BigNumber from 'bignumber.js';
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
  NodeOnlineIcon,
  SharedIdentity
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
  const bNAuctionTopup = new BigNumber(nodeData.auctionTopUp ?? 0);
  const bNqualifiedStake =
    nodeData.qualifiedStake !== undefined
      ? new BigNumber(nodeData.qualifiedStake)
      : new BigNumber(nodeData.stake).plus(
          nodeData.auctionQualified ? bNAuctionTopup : 0
        );

  return (
    <tr>
      {status === NodeStatusEnum.queued && (
        <td>
          {nodeData.position ? (
            <div>{nodeData.position}</div>
          ) : (
            <span className='text-neutral-400'>N/A</span>
          )}
        </td>
      )}
      <td>
        <div className='d-flex align-items-center gap-1 hash hash-lg'>
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
      {type !== NodeTypeEnum.observer && (
        <td>
          <NodeStatus node={nodeData} />
        </td>
      )}
      {status === NodeStatusEnum.auction && (
        <td>
          <NodeQualification node={nodeData} showDangerZone />
        </td>
      )}
      {(type === NodeTypeEnum.validator ||
        status === NodeStatusEnum.auction) && (
        <td>
          {status !== NodeStatusEnum.auction || nodeData.auctionQualified ? (
            <Overlay
              title={
                <NodeLockedStakeTooltip
                  node={nodeData}
                  showAuctionTopup={
                    status === NodeStatusEnum.auction ||
                    nodeData.auctionQualified
                  }
                />
              }
              className='text-neutral-100'
              tooltipClassName='tooltip-text-start tooltip-lg'
              truncate
            >
              <FormatAmount
                value={
                  nodeData.auctionQualified
                    ? bNqualifiedStake.toString(10)
                    : nodeData.locked
                }
                showTooltip={false}
              />
            </Overlay>
          ) : (
            <FormatAmount
              value={
                nodeData.auctionQualified
                  ? bNqualifiedStake.toString(10)
                  : nodeData.locked
              }
            />
          )}
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
