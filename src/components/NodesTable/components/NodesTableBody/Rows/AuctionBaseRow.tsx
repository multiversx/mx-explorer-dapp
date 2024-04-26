import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  NodeQualification,
  NetworkLink,
  Trim,
  Overlay,
  FormatAmount,
  NodeDangerZoneTooltip,
  NodeFullHistoryIcon,
  NodeIssueIcon,
  NodeLockedStakeTooltip,
  NodeThreshold,
  SharedIdentity,
  NodeChangingShardIcon,
  ShardSpan,
  NodeOnlineIcon
} from 'components';
import { urlBuilder } from 'helpers';
import { nodesIdentitiesSelector, stakeSelector } from 'redux/selectors';
import { NodeType, WithClassnameType } from 'types';

export interface AuctionBaseRowUIType extends WithClassnameType {
  nodeData: NodeType;
  index?: number;
  showPosition?: boolean;
}

export const AuctionBaseRow = ({
  nodeData,
  index,
  showPosition,
  className
}: AuctionBaseRowUIType) => {
  const { nodesIdentities } = useSelector(nodesIdentitiesSelector);
  const {
    isFetched: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake, notQualifiedAuctionValidators }
  } = useSelector(stakeSelector);

  if (!isStakeFetched || !minimumAuctionQualifiedStake) {
    return null;
  }

  const bNAuctionTopup = new BigNumber(nodeData.auctionTopUp ?? 0);
  const bNLocked = new BigNumber(nodeData.stake).plus(
    nodeData.auctionQualified ? bNAuctionTopup : 0
  );

  const isDangerZone =
    nodeData.isInDangerZone &&
    nodeData.auctionQualified &&
    notQualifiedAuctionValidators;

  return (
    <tr className={classNames(className)}>
      <td>
        <div className='d-flex align-items-center gap-1 hash hash-lg'>
          {showPosition && <td>{index ?? nodeData.auctionPosition}</td>}
          <NodeOnlineIcon node={nodeData} className='mx-2' />
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
      <td>
        {nodeData.auctionQualified ? (
          <Overlay
            title={<NodeLockedStakeTooltip node={nodeData} showAuctionTopup />}
            tooltipClassName='tooltip-text-start tooltip-lg'
            persistent
            truncate
          >
            <FormatAmount value={bNLocked.toString(10)} showTooltip={false} />
          </Overlay>
        ) : (
          <FormatAmount value={bNLocked.toString(10)} />
        )}
      </td>
      <td>
        <NodeThreshold qualifiedStake={nodeData.qualifiedStake} />
      </td>
      <td>
        <NodeQualification node={nodeData} showDangerZone={false} />
      </td>
    </tr>
  );
};
