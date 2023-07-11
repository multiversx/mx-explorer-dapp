import React from 'react';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { CardItem, Denominate, LockedAmountTooltip } from 'components';

import { accountStakingSelector } from 'redux/selectors';

export const LockedAmountCardItem = ({
  cardItemClass
}: {
  cardItemClass: string;
}) => {
  const {
    stakingDataReady,
    totalStaked,
    totalDelegation,
    totalLegacyDelegation,
    totalLocked,
    totalClaimable,
    totalActiveStake,
    totalUnstakedValue
  } = useSelector(accountStakingSelector);

  const bNtotalStaked = new BigNumber(totalStaked);
  const bNtotalActiveStake = new BigNumber(totalActiveStake);
  const bNtotalLegacyDelegation = new BigNumber(totalLegacyDelegation);
  const bNtotalLocked = new BigNumber(totalLocked);
  const bNtotalClaimable = new BigNumber(totalClaimable);
  const bNUnstaked = new BigNumber(totalUnstakedValue);

  const lockedDetails = [
    {
      label: 'Stake',
      value: <Denominate value={bNtotalStaked.toString(10)} />
    },
    {
      label: 'Delegation',
      value: <Denominate value={bNtotalActiveStake.toString(10)} />
    },
    {
      label: 'Legacy Delegation',
      value: <Denominate value={bNtotalLegacyDelegation.toString(10)} />
    },
    {
      label: 'Claimable Rewards',
      value: <Denominate value={bNtotalClaimable.toString(10)} />
    }
  ];

  if (bNUnstaked.isGreaterThan(0)) {
    lockedDetails.push({
      label: 'Unstaked',
      value: <Denominate value={bNUnstaked.toString(10)} />
    });
  }

  return (
    <CardItem className={cardItemClass} title='Stake' icon={faLock}>
      <div className='d-flex align-items-center'>
        {stakingDataReady ? (
          <span className='me-2'>
            <Denominate value={bNtotalLocked.toString(10)} />
          </span>
        ) : (
          <>...</>
        )}
        {stakingDataReady && (
          <LockedAmountTooltip lockedDetails={lockedDetails} />
        )}
      </div>
    </CardItem>
  );
};
