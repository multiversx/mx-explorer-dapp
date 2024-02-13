import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { ELLIPSIS } from 'appConstants';

import { Denominate } from 'components';
import { useGetRemainingTime } from 'hooks';
import { faClock } from 'icons/solid';
import { stakeSelector, statsSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

import { NodesEligibilityPercentageBar } from './components';

export const NodesTableHero = ({ className }: WithClassnameType) => {
  const { isFetched: isStakeFetched, unprocessed } = useSelector(stakeSelector);
  const {
    isFetched: isStatsFetched,
    unprocessed: { epochTimeRemaining: unprocessedEpochTimeRemaining },
    epoch
  } = useSelector(statsSelector);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const currentTimestamp = useMemo(
    () => moment().unix() + unprocessedEpochTimeRemaining / 1000,
    [refreshTrigger]
  );
  const remainingTime = useGetRemainingTime({
    timeData: currentTimestamp,
    onCountdownEnd: () => {
      setRefreshTrigger(unprocessedEpochTimeRemaining);
    }
  });

  const [_omit, hours, minutes, seconds] = remainingTime;

  if (!isStakeFetched) {
    return null;
  }

  return (
    <div className={classNames('nodes-table-hero w-100 mb-3', className)}>
      <div className='row gy-3'>
        <div className='col-xl-7'>
          <div className='card bg-neutral-800-opacity-60'>
            <div className='card-body d-flex flex-column gap-3'>
              <h4 className='mb-0'>Qualified Nodes</h4>
              <NodesEligibilityPercentageBar />
            </div>
          </div>
        </div>
        <div className='col-xl-5'>
          <div className='d-flex flex-column gap-3 h-100'>
            <div className='card bg-neutral-800-opacity-60 flex-fill'>
              <div className='card-body d-flex align-items-center'>
                <div className='d-flex w-100 flex-wrap gap-3 align-items-start justify-content-between'>
                  <div className='text-primary-100 small'>
                    <FontAwesomeIcon icon={faClock} className='me-2' />
                    {epoch !== undefined ? (
                      <>Epoch {new BigNumber(epoch).toFormat(0)}</>
                    ) : (
                      ELLIPSIS
                    )}{' '}
                    ends in
                  </div>
                  <h3 className='mb-0 text-primary text-lh-24'>
                    {isStatsFetched ? (
                      <>
                        <span className='time-container'>{hours.time}</span>h{' '}
                        <span className='time-container'>{minutes.time}</span>
                        min{' '}
                        <span className='time-container'>{seconds.time}</span>
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
              <div className='card bg-neutral-800-opacity-60 flex-fill'>
                <div className='card-body d-flex align-items-center'>
                  <div className='d-flex w-100 flex-wrap gap-3 align-items-start justify-content-between'>
                    <div className='text-neutral-500 small'>
                      Node Qualification Threshold
                    </div>
                    <h3 className='mb-0 text-lh-24'>
                      <Denominate
                        value={unprocessed.minimumAuctionQualifiedStake}
                        superSuffix
                        decimals={4}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
