import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { ELLIPSIS } from 'appConstants';

import { FormatAmount } from 'components';
import { useGetEpochRemainingTime } from 'hooks';
import { faClock } from 'icons/solid';
import { stakeSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export const NodesEpochStatusCards = ({ className }: WithClassnameType) => {
  const { isFetched: isStakeFetched, unprocessed } = useSelector(stakeSelector);
  const { epoch, remainingTime, isStatsFetched } = useGetEpochRemainingTime();

  const [days, hours, minutes, seconds] = remainingTime;

  if (!isStakeFetched) {
    return null;
  }

  return (
    <div
      className={classNames(
        'epoch-status-cards d-flex flex-column gap-3 h-100',
        className
      )}
    >
      <div className='card bg-neutral-800-opacity-60 flex-fill epoch-status'>
        <div className='card-body d-flex align-items-center'>
          <div className='d-flex w-100 flex-wrap gap-1 gap-sm-3 align-items-start justify-content-between'>
            <div className='text-primary-100 status-title'>
              <FontAwesomeIcon icon={faClock} className='me-2' />
              {epoch !== undefined ? (
                <>Epoch {new BigNumber(epoch).toFormat(0)}</>
              ) : (
                ELLIPSIS
              )}{' '}
              ends in
            </div>
            <h3 className='mb-0 text-primary text-lh-24 status-value'>
              {isStatsFetched ? (
                <>
                  {days.time && days.time !== '00' && (
                    <span className='time-container'>{days.time}</span>
                  )}
                  <span className='time-container'>{hours.time}</span>h{' '}
                  <span className='time-container'>{minutes.time}</span>
                  min <span className='time-container'>{seconds.time}</span>
                  sec
                </>
              ) : (
                ELLIPSIS
              )}
            </h3>
          </div>
        </div>
      </div>
      {unprocessed.minimumAuctionQualifiedStake && (
        <div className='card bg-neutral-800-opacity-60 flex-fill auction-status'>
          <div className='card-body d-flex align-items-center'>
            <div className='d-flex w-100 flex-wrap gap-1 gap-sm-3 align-items-start justify-content-between'>
              <div className='text-neutral-500 status-title'>
                Node Qualification Threshold
              </div>
              <h3 className='mb-0 text-lh-24 status-value'>
                <FormatAmount
                  value={unprocessed.minimumAuctionQualifiedStake}
                  digits={4}
                  superSuffix
                />
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
