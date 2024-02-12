import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Led, NodeDangerZoneTooltip } from 'components';
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
    unprocessed: { minimumAuctionQualifiedTopUp }
  } = useSelector(stakeSelector);
  const { auctionTopUp, auctionQualified } = node;

  if (
    !isStakeFetched ||
    minimumAuctionQualifiedTopUp === undefined ||
    auctionTopUp === undefined
  ) {
    return null;
  }

  const NodeStatusComponent = () => {
    const bNTopup = new BigNumber(auctionTopUp);
    const bNMinimumAuctionTopup = new BigNumber(minimumAuctionQualifiedTopUp);

    if (
      auctionQualified ||
      bNTopup.isGreaterThanOrEqualTo(bNMinimumAuctionTopup)
    ) {
      if (showDangerZone) {
        return (
          <>
            <Led color='bg-red-400' />
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
        <Led color='bg-neutral-500' />
        <span className='text-neutral-500'>
          {NodeQualificationStatusEnum.notQualified}
        </span>
      </>
    );
  };

  return (
    <div className={classNames('d-flex align-items-center gap-2', className)}>
      <NodeStatusComponent />
    </div>
  );
};
