import { LockedStakeTooltip } from 'components';
import { NodeType, NodeTypeEnum } from 'types';

export interface NodeLockedStakeTooltipUIType {
  node: NodeType;
  showAuctionTopup?: boolean;
}

export const NodeLockedStakeTooltip = ({
  node,
  showAuctionTopup
}: NodeLockedStakeTooltipUIType) => {
  if (!node) {
    return null;
  }

  const hasLockedAndStake =
    node.type === NodeTypeEnum.validator &&
    node.locked !== undefined &&
    node.stake !== undefined;

  if (
    hasLockedAndStake ||
    node.topUp !== undefined ||
    node.auctionTopUp !== undefined
  ) {
    return (
      <LockedStakeTooltip
        stake={node.stake}
        topUp={node.topUp}
        auctionTopUp={node.auctionTopUp}
        showAuctionTopup={showAuctionTopup}
      />
    );
  }

  return null;
};
