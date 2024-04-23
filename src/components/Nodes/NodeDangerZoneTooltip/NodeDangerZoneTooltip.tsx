import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { FormatAmount, Led, Overlay } from 'components';
import { faDiamondExclamation } from 'icons/solid';
import { stakeSelector } from 'redux/selectors';
import { WithClassnameType, NodeQualificationStatusEnum } from 'types';

export interface NodeDangerZoneTooltipUIType extends WithClassnameType {
  qualifiedStake?: string;
  isInDangerZone?: boolean;
  auctionQualified?: boolean;
  showText?: boolean;
}

export const NodeDangerZoneTooltip = ({
  qualifiedStake,
  isInDangerZone,
  auctionQualified = true,
  showText,
  className
}: NodeDangerZoneTooltipUIType) => {
  const {
    isFetched: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake, notQualifiedAuctionValidators }
  } = useSelector(stakeSelector);

  if (
    !isStakeFetched ||
    !auctionQualified ||
    !notQualifiedAuctionValidators ||
    !minimumAuctionQualifiedStake ||
    qualifiedStake === undefined
  ) {
    return null;
  }

  const bNQualifiedStake = new BigNumber(qualifiedStake);
  const bNMinimumAuctionStake = new BigNumber(minimumAuctionQualifiedStake);

  const displayDangerZone =
    isInDangerZone ??
    bNQualifiedStake.isGreaterThanOrEqualTo(bNMinimumAuctionStake);

  if (displayDangerZone) {
    const bNDangerZoneTreshold = bNMinimumAuctionStake
      .times(105)
      .dividedBy(100)
      .decimalPlaces(0, 1);
    const bNLockedAboveTreshold = bNQualifiedStake.minus(bNMinimumAuctionStake);
    const bNLockedNeededAboveDangerZone =
      bNDangerZoneTreshold.minus(bNQualifiedStake);

    if (bNLockedNeededAboveDangerZone.isLessThan(0)) {
      return null;
    }

    return (
      <div className={classNames('d-flex align-items-center gap-1', className)}>
        <span className='text-orange-400'>
          {showText && <>{NodeQualificationStatusEnum.dangerZone}</>}
          {bNQualifiedStake.isGreaterThanOrEqualTo(bNMinimumAuctionStake) && (
            <Overlay
              title={
                <>
                  <p className='mb-2 h6'>
                    Danger Zone <Led color='bg-orange-400 ms-1' />
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
              tooltipClassName='tooltip-text-start tooltip-lg'
              persistent
            >
              <FontAwesomeIcon
                icon={faDiamondExclamation}
                className='text-orange-400'
              />
            </Overlay>
          )}
        </span>
      </div>
    );
  }

  return null;
};
