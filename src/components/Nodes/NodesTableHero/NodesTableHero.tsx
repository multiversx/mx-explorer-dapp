import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Denominate } from 'components';
import { faClock } from 'icons/solid';
import { stakeSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

import { NodesEligibilityPercentageBar } from './components';

export const NodesTableHero = ({ className }: WithClassnameType) => {
  const {
    isFetched: isStakeFetched,
    minimumAuctionStake,
    unprocessed
  } = useSelector(stakeSelector);

  if (!isStakeFetched) {
    return null;
  }

  return (
    <div className={classNames('nodes-table-hero w-100 mb-3', className)}>
      <div className='row gy-3'>
        <div className='col-xl-7'>
          <div className='card bg-neutral-800'>
            <div className='card-body d-flex flex-column gap-3'>
              <h4 className='mb-0'>Eligible Nodes</h4>
              <NodesEligibilityPercentageBar />
            </div>
          </div>
        </div>
        <div className='col-xl-5'>
          <div className='d-flex flex-column gap-3 h-100'>
            <div className='card bg-neutral-800 flex-fill'>
              <div className='card-body d-flex align-items-center'>
                <div className='d-flex w-100 flex-wrap gap-3 align-items-start justify-content-between'>
                  <div className='text-primary-100 small'>
                    <FontAwesomeIcon icon={faClock} className='me-2' />
                    Epoch 1262 ends in
                  </div>
                  <h3 className='mb-0 text-primary text-lh-24'>
                    3h 45min 12sec
                  </h3>
                </div>
              </div>
            </div>
            <div className='card bg-neutral-800 flex-fill'>
              <div className='card-body d-flex align-items-center'>
                <div className='d-flex w-100 flex-wrap gap-3 align-items-start justify-content-between'>
                  <div className='text-neutral-500 small'>
                    Node Eligibility Threshold
                  </div>
                  <h3 className='mb-0 text-lh-24'>
                    {unprocessed.minimumAuctionStake ? (
                      <Denominate
                        value={unprocessed.minimumAuctionStake}
                        superSuffix
                        decimals={4}
                      />
                    ) : (
                      minimumAuctionStake
                    )}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
