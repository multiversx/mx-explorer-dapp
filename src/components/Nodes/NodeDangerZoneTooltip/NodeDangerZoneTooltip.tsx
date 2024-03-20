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
  const { stake, auctionTopUp, isInDangerZone } = node;

  if (
    !isStakeFetched ||
    minimumAuctionQualifiedStake === undefined ||
    stake === undefined ||
    !node.auctionQualified
  ) {
    return null;
  }

  const bNStake = new BigNumber(stake).plus(auctionTopUp ?? 0);
  const bNMinimumAuctionStake = new BigNumber(minimumAuctionQualifiedStake);

  if (bNStake.isGreaterThanOrEqualTo(bNMinimumAuctionStake) && isInDangerZone) {
    const bNDangerZoneTreshold = bNMinimumAuctionStake
      .times(105)
      .dividedBy(100)
      .decimalPlaces(0, 1);
    const bNStakeAboveTreshold = bNStake.minus(bNMinimumAuctionStake);
    const bNStakeNeededAboveDangerZone = bNDangerZoneTreshold.minus(bNStake);

    return (
      <div className={classNames('d-flex align-items-center gap-1', className)}>
        <span className='text-red-400'>
          {NodeQualificationStatusEnum.dangerZone}
          <Overlay
            title={
              <>
                <p className='mb-2 h6'>
                  Danger Zone <Led color='bg-danger ms-1' />
                </p>
                <p className='mb-0'>
                  This node is only{' '}
                  <FormatAmount
                    value={bNStakeAboveTreshold.toString(10)}
                    digits={4}
                  />{' '}
                  above the threshold level.
                  {bNStakeNeededAboveDangerZone.isGreaterThan(0) && (
                    <>
                      {' '}
                      Increase the staked amount with{' '}
                      <FormatAmount
                        value={bNStakeNeededAboveDangerZone.toString(10)}
                        digits={4}
                      />{' '}
                      / node to exit the danger zone and move up in the auction
                      list.
                    </>
                  )}
                </p>
              </>
            }
            className='side-action cursor-context'
            tooltipClassName='tooltip-text-start tooltip-lg'
            persistent
          >
            <FontAwesomeIcon icon={faSquareInfo} className='text-red-400' />
          </Overlay>
        </span>
      </div>
    );
  }

  return null;
};
