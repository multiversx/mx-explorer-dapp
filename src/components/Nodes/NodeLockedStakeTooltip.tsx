import { Denominate } from 'components';
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
      <div className='d-flex flex-column gap-1'>
        {node.stake && (
          <p className='mb-0'>
            Staked: <Denominate value={node.stake} showTooltip={false} />
          </p>
        )}
        {node.topUp && (
          <p className='mb-0'>
            Top Up: <Denominate value={node.topUp} showTooltip={false} />
          </p>
        )}
        {node.auctionTopUp && showAuctionTopup && (
          <p className='mb-0'>
            Auction Qualified Top Up:{' '}
            <Denominate value={node.auctionTopUp} showTooltip={false} />
          </p>
        )}
      </div>
    );
  }

  return null;
};
