import { LockedStakeTooltip } from 'components';
import { NodeType } from 'types';

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

  if (
    (node.type === 'validator' && node.locked && node.stake) ||
    node.topUp ||
    node.auctionTopUp
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
