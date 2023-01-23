import React from 'react';
import BigNumber from 'bignumber.js';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { CardItem, Denominate, LockedAmountTooltip } from 'components';

import { useSelector } from 'react-redux';
import { accountStakingSelector } from 'redux/selectors';

export const LockedAmountCardItem = ({ cardItemClass }: { cardItemClass: string }) => {
  const {
    stakingDataReady,
    totalStaked,
    totalDelegation,
    totalLegacyDelegation,
    totalLocked,
    totalClaimable,
  } = useSelector(accountStakingSelector);

  const bNtotalStaked = new BigNumber(totalStaked);
  const bNtotalDelegation = new BigNumber(totalDelegation);
  const bNtotalLegacyDelegation = new BigNumber(totalLegacyDelegation);
  const bNtotalLocked = new BigNumber(totalLocked);
  const bNtotalClaimable = new BigNumber(totalClaimable);

  return (
    <CardItem className={cardItemClass} title="Stake" icon={faLock}>
      <div className="d-flex align-items-center">
        {stakingDataReady ? (
          <span className="mr-2">
            <Denominate value={bNtotalLocked.toString(10)} />
          </span>
        ) : (
          <>...</>
        )}
        {stakingDataReady && (
          <LockedAmountTooltip
            lockedDetails={[
              {
                label: 'Stake',
                value: <Denominate value={bNtotalStaked.toString(10)} />,
              },
              {
                label: 'Delegation',
                value: <Denominate value={bNtotalDelegation.toString(10)} />,
              },
              {
                label: 'Legacy Delegation',
                value: <Denominate value={bNtotalLegacyDelegation.toString(10)} />,
              },
              {
                label: 'Claimable Rewards',
                value: <Denominate value={bNtotalClaimable.toString(10)} />,
              },
            ]}
          />
        )}
      </div>
    </CardItem>
  );
};
