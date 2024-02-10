import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Denominate, Led, Overlay } from 'components';
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
    unprocessed: { minimumAuctionTopup }
  } = useSelector(stakeSelector);

  if (!isStakeFetched || minimumAuctionTopup === undefined) {
    return null;
  }

  const { topUp, auctionTopUp, isInDangerZone } = node;
  const bNTopup = new BigNumber(auctionTopUp ?? topUp);
  const bNMinimumAuctionTopup = new BigNumber(minimumAuctionTopup);

  if (bNTopup.isGreaterThanOrEqualTo(bNMinimumAuctionTopup)) {
    const topupNeeded = bNTopup.minus(bNMinimumAuctionTopup);

    if (isInDangerZone || topupNeeded.isGreaterThanOrEqualTo(0)) {
      const dangerZoneThreshold = bNMinimumAuctionTopup.times(0.05);

      return (
        <div
          className={classNames('d-flex align-items-center gap-1', className)}
        >
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
                    <Denominate value={topupNeeded.toString(10)} /> above the
                    threshold level.
                    {dangerZoneThreshold.isGreaterThan(0) && (
                      <>
                        {' '}
                        Increase the staked amount with{' '}
                        <Denominate
                          value={dangerZoneThreshold.toString(10)}
                        />{' '}
                        / node to exit the danger zone and move up on the
                        auction list.
                      </>
                    )}
                  </p>
                </>
              }
              className='side-action cursor-context'
              tooltipClassName='tooltip-text-start tooltip-lg'
            >
              <FontAwesomeIcon icon={faSquareInfo} className='text-red-400' />
            </Overlay>
          </span>
        </div>
      );
    }
  }

  return null;
};
