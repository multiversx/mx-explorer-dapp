import BigNumber from 'bignumber.js';

import { Overlay, FormatAmount, NodeLockedStakeTooltip } from 'components';
import { useIsAuctionNodeDropped } from 'hooks';
import { NodeStatusEnum, NodeType } from 'types';

interface NodeLockedStakeUIType {
  node: NodeType;
  showLabel?: boolean;
}

export const NodeLockedStake = ({
  node,
  showLabel = true
}: NodeLockedStakeUIType) => {
  const isDropped = useIsAuctionNodeDropped(node);
  const bNAuctionTopup = new BigNumber(node.auctionTopUp ?? 0);
  const bNqualifiedStake =
    node.qualifiedStake !== undefined
      ? new BigNumber(node.qualifiedStake)
      : new BigNumber(node.stake).plus(
          node.auctionQualified ? bNAuctionTopup : 0
        );

  if (isDropped) {
    return (
      <FormatAmount
        className='text-neutral-100'
        value={node.stake}
        showTooltip={false}
        showLabel={showLabel}
      />
    );
  }

  return (
    <Overlay
      title={
        <NodeLockedStakeTooltip
          node={node}
          showAuctionTopup={
            node.status === NodeStatusEnum.auction || node.auctionQualified
          }
        />
      }
      className='text-neutral-100'
      tooltipClassName='tooltip-text-start tooltip-lg'
      truncate
    >
      <FormatAmount
        value={node.auctioned ? bNqualifiedStake.toString(10) : node.locked}
        showTooltip={false}
        showLabel={showLabel}
      />
    </Overlay>
  );
};
