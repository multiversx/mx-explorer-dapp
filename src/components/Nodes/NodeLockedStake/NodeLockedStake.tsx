import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { Overlay, FormatAmount, NodeLockedStakeTooltip } from 'components';
import { stakeSelector } from 'redux/selectors';
import { NodeStatusEnum, NodeType } from 'types';

export interface StandardRowUIType {
  node: NodeType;
  showLabel?: boolean;
}

export const NodeLockedStake = ({
  node,
  showLabel = true
}: StandardRowUIType) => {
  const {
    isFetched: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);

  const bNAuctionTopup = new BigNumber(node.auctionTopUp ?? 0);
  const bNqualifiedStake =
    node.qualifiedStake !== undefined
      ? new BigNumber(node.qualifiedStake)
      : new BigNumber(node.stake).plus(
          node.auctionQualified ? bNAuctionTopup : 0
        );

  const isDropped =
    isStakeFetched &&
    node.auctioned &&
    !node.auctionQualified &&
    bNqualifiedStake.isGreaterThan(minimumAuctionQualifiedStake ?? 0) &&
    bNAuctionTopup.isGreaterThan(0);

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
