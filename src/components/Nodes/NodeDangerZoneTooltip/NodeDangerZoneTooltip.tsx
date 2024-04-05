import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { FormatAmount, Led, Overlay } from 'components';
import { faSquareInfo } from 'icons/solid';
import { stakeSelector } from 'redux/selectors';
import {
  NodeType,
  WithClassnameType,
  NodeQualificationStatusEnum
} from 'types';

export interface NodeDangerZoneTooltipUIType extends WithClassnameType {
  node: NodeType;
}

export const NodeDangerZoneTooltip = ({
  node,
  className
}: NodeDangerZoneTooltipUIType) => {
  const {
    isFetched: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);
  const { locked, stake, auctionTopUp, isInDangerZone, auctionQualified } =
    node;

  if (
    !isStakeFetched ||
    minimumAuctionQualifiedStake === undefined ||
    locked === undefined ||
    !auctionQualified
  ) {
    return null;
  }

  const bNLocked = new BigNumber(stake).plus(auctionTopUp ?? 0);
  const bNMinimumAuctionStake = new BigNumber(minimumAuctionQualifiedStake);

  if (isInDangerZone) {
    const bNDangerZoneTreshold = bNMinimumAuctionStake
      .times(105)
      .dividedBy(100)
      .decimalPlaces(0, 1);
    const bNLockedAboveTreshold = bNLocked.minus(bNMinimumAuctionStake);
    const bNLockedNeededAboveDangerZone = bNDangerZoneTreshold.minus(bNLocked);

    return (
      <div className={classNames('d-flex align-items-center gap-1', className)}>
        <span className='text-red-400'>
          {NodeQualificationStatusEnum.dangerZone}
          {bNLocked.isGreaterThanOrEqualTo(bNMinimumAuctionStake) && (
            <Overlay
              title={
                <>
                  <p className='mb-2 h6'>
                    Danger Zone <Led color='bg-danger ms-1' />
                  </p>
                  <p className='mb-0'>
                    This node is only{' '}
                    <FormatAmount
                      value={bNLockedAboveTreshold.toString(10)}
                      digits={4}
                    />{' '}
                    above the threshold level.
                    {bNLockedNeededAboveDangerZone.isGreaterThan(0) && (
                      <>
                        {' '}
                        Increase the staked amount with{' '}
                        <FormatAmount
                          value={bNLockedNeededAboveDangerZone.toString(10)}
                          digits={4}
                        />{' '}
                        / node to exit the danger zone and move up in the
                        auction list.
                      </>
                    )}
                  </p>
                </>
              }
              className='side-action'
              tooltipClassName='tooltip-text-start tooltip-lg'
              persistent
            >
              <FontAwesomeIcon icon={faSquareInfo} className='text-red-400' />
            </Overlay>
          )}
        </span>
      </div>
    );
  }

  return null;
};
