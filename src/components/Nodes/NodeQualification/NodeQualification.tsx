import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Led, NodeDangerZoneTooltip, InfoTooltip } from 'components';
import { stakeSelector } from 'redux/selectors';
import {
  NodeType,
  WithClassnameType,
  NodeQualificationStatusEnum
} from 'types';

export interface NodeQualificationUIType extends WithClassnameType {
  node: NodeType;
  showDangerZone?: boolean;
}

export const NodeQualification = ({
  node,
  showDangerZone = false,
  className
}: NodeQualificationUIType) => {
  const {
    isFetched: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake, notQualifiedAuctionValidators }
  } = useSelector(stakeSelector);
  const { stake, auctionTopUp, auctionQualified, isInDangerZone } = node;

  const bNAuctionTopup = new BigNumber(auctionTopUp ?? 0);
  const bNTotalLocked = new BigNumber(stake).plus(bNAuctionTopup);
  const isDropped =
    !auctionQualified &&
    bNTotalLocked.isGreaterThan(minimumAuctionQualifiedStake ?? 0) &&
    bNAuctionTopup.isGreaterThan(0);

  const NodeStatusComponent = () => {
    if (auctionQualified) {
      if (showDangerZone && isInDangerZone && notQualifiedAuctionValidators) {
        return (
          <>
            <Led color='bg-orange-400' />
            <NodeDangerZoneTooltip node={node} />
          </>
        );
      }

      return (
        <>
          <Led color='bg-success' />
          <span className='text-success'>
            {NodeQualificationStatusEnum.qualified}
          </span>
        </>
      );
    }

    return (
      <>
        <Led color='bg-red-400' />
        <span className='text-red-400'>
          {NodeQualificationStatusEnum.notQualified}
        </span>
        {isStakeFetched && minimumAuctionQualifiedStake && isDropped && (
          <InfoTooltip title='Dropped' className='ms-0 text-red-400' />
        )}
      </>
    );
  };

  return (
    <div className={classNames('d-flex align-items-center gap-2', className)}>
      <NodeStatusComponent />
    </div>
  );
};
