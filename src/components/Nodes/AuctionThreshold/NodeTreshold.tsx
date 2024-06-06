import BigNumber from 'bignumber.js';
import { AuctionThreshold } from 'components';
import { useIsAuctionNodeDropped } from 'hooks';
import { NodeType, WithClassnameType } from 'types';

export interface NodeThresholdUIType extends WithClassnameType {
  node?: NodeType;
  showPercentage?: boolean;
}

export const NodeThreshold = ({
  node,
  showPercentage,
  className
}: NodeThresholdUIType) => {
  const isDropped = useIsAuctionNodeDropped(node);

  if (!node) {
    return null;
  }

  const bNAuctionTopup = new BigNumber(node.auctionTopUp ?? 0);
  const bNqualifiedStake =
    node.qualifiedStake !== undefined
      ? new BigNumber(node.qualifiedStake)
      : new BigNumber(node.stake).plus(
          node.auctionQualified ? bNAuctionTopup : 0
        );

  if (isDropped) {
    return (
      <AuctionThreshold
        qualifiedStake={node.stake}
        showPercentage={showPercentage}
        className={className}
      />
    );
  }

  return (
    <AuctionThreshold
      qualifiedStake={bNqualifiedStake.toString(10)}
      showPercentage={showPercentage}
      className={className}
    />
  );
};
