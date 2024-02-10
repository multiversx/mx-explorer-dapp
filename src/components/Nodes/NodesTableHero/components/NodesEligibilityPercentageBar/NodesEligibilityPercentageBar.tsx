import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { MultilayerPercentageBar, Overlay, Led } from 'components';
import { faSquareInfo } from 'icons/solid';
import { stakeSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export const NodesEligibilityPercentageBar = ({
  className
}: WithClassnameType) => {
  const {
    isFetched: isStakeFetched,
    eligibleValidators,
    notEligibleValidators,
    dangerZoneValidators,
    unprocessed
  } = useSelector(stakeSelector);

  if (
    !isStakeFetched ||
    !(
      unprocessed.notEligibleValidators &&
      unprocessed.eligibleValidators &&
      unprocessed.dangerZoneValidators
    )
  ) {
    return null;
  }

  const totalValidators = new BigNumber(unprocessed.eligibleValidators)
    .plus(unprocessed.dangerZoneValidators)
    .plus(unprocessed.notEligibleValidators);

  const percentageNotEligible = new BigNumber(unprocessed.notEligibleValidators)
    .dividedBy(totalValidators)
    .times(100);
  const percentageDangerZone = new BigNumber(unprocessed.dangerZoneValidators)
    .dividedBy(totalValidators)
    .times(100);
  const percentageEligible = new BigNumber(unprocessed.eligibleValidators)
    .dividedBy(totalValidators)
    .times(100);

  return (
    <MultilayerPercentageBar
      steps={[
        {
          name: 'Not Qualified',
          value: percentageNotEligible.toFixed(2),
          className: 'bg-neutral-750',
          legend: (
            <div
              className='legend'
              style={{ width: `${percentageNotEligible.toFixed(2)}%` }}
            >
              <div className='name'>Not Qualified</div>
              <div className='description'>{notEligibleValidators}</div>
              <div className='value'>{percentageNotEligible.toFormat(0)}%</div>
            </div>
          )
        },
        {
          name: 'Danger Zone',
          value: percentageDangerZone.toFixed(2),
          className: 'bg-red-400',
          legend: (
            <div
              className='legend'
              style={{ width: `${percentageDangerZone.toFixed(2)}%` }}
            >
              <div className='name'>
                Danger Zone
                <Overlay
                  title={
                    <>
                      <p className='mb-2 h6'>
                        Danger Zone <Led color='bg-danger ms-1' />
                      </p>
                      <p className='text-neutral-400 mb-0'>
                        {dangerZoneValidators} nodes are 5% above the threshold
                        level. Increase the staked amount / node to exit the
                        danger zone and move up on the auction list.
                      </p>
                    </>
                  }
                  className='side-action cursor-context'
                  tooltipClassName='tooltip-text-start tooltip-lg'
                >
                  <FontAwesomeIcon icon={faSquareInfo} />
                </Overlay>
              </div>
              <div className='description'>{dangerZoneValidators}</div>
              <div className='value'>{percentageDangerZone.toFormat(0)}%</div>
            </div>
          )
        },
        {
          name: 'Qualified',
          value: percentageEligible.toFixed(2),
          className: 'bg-green-400',
          legend: (
            <div
              className='legend'
              style={{ width: `${percentageEligible.toFixed(2)}%` }}
            >
              <div className='name'>Qualified</div>
              <div className='description'>{eligibleValidators}</div>
              <div className='value'>{percentageEligible.toFormat(0)}%</div>
            </div>
          )
        }
      ]}
      className={classNames('nodes-eligibility-percentage-bar', className)}
      legendClassName='eligibility-legend-container'
    />
  );
};
