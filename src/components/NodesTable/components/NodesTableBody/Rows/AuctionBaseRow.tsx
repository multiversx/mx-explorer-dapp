import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  NodeQualification,
  NetworkLink,
  Trim,
  Overlay,
  FormatAmount,
  NodeFullHistoryIcon,
  NodeIssueIcon,
  NodeLockedStakeTooltip,
  NodeThreshold,
  SharedIdentity,
  NodeChangingShardIcon,
  NodeOnlineIcon,
  ShardLink
} from 'components';
import { urlBuilder } from 'helpers';
import { stakeSelector } from 'redux/selectors';
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
  const {
    isFetched: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);

  if (!isStakeFetched || !minimumAuctionQualifiedStake) {
    return null;
  }

  const bNAuctionTopup = new BigNumber(nodeData.auctionTopUp ?? 0);
  const bNqualifiedStake =
    nodeData.qualifiedStake !== undefined
      ? new BigNumber(nodeData.qualifiedStake)
      : new BigNumber(nodeData.stake).plus(
          nodeData.auctionQualified ? bNAuctionTopup : 0
        );

  return (
    <tr className={classNames(className)}>
      <td>
        <div className='d-flex align-items-center gap-1 hash hash-lg'>
          {showPosition && <span>{index ?? nodeData.auctionPosition}</span>}
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
          <ShardLink shard={nodeData.shard} data-testid={`shardLink${index}`} />
        </div>
      </td>
      <td>
        {nodeData.version ? (
          nodeData.version
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td className='text-neutral-100'>
        {nodeData.auctionQualified ? (
          <Overlay
            title={<NodeLockedStakeTooltip node={nodeData} showAuctionTopup />}
            tooltipClassName='tooltip-text-start tooltip-lg'
            persistent
            truncate
          >
            <FormatAmount
              value={bNqualifiedStake.toString(10)}
              showTooltip={false}
            />
          </Overlay>
        ) : (
          <FormatAmount value={bNqualifiedStake.toString(10)} />
        )}
      </td>
      <td>
        <NodeThreshold qualifiedStake={bNqualifiedStake.toString(10)} />
      </td>
      <td>
        <NodeQualification node={nodeData} />
      </td>
    </tr>
  );
};
