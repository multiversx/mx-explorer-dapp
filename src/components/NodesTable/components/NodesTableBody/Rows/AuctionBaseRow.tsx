import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  NodeQualification,
  NetworkLink,
  Trim,
  NodeFullHistoryIcon,
  NodeIssueIcon,
  NodeLockedStake,
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
    isDataReady: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);

  if (!isStakeFetched || !minimumAuctionQualifiedStake) {
    return null;
  }

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
        <NodeLockedStake node={nodeData} />
      </td>
      <td>
        <NodeThreshold node={nodeData} />
      </td>
      <td>
        <NodeQualification node={nodeData} />
      </td>
    </tr>
  );
};
