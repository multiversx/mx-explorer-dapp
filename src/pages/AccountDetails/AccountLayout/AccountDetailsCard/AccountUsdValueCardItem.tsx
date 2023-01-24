import React from 'react';
import { faDollarSign } from '@fortawesome/pro-solid-svg-icons/faDollarSign';
import BigNumber from 'bignumber.js';

import { useSelector } from 'react-redux';
import { CardItem, LockedAmountTooltip, UsdValue } from 'components';
import { accountSelector, accountStakingSelector } from 'redux/selectors';

export const AccountUsdValueCardItem = ({
  cardItemClass
}: {
  cardItemClass: string;
}) => {
  const { balance } = useSelector(accountSelector);
  const { stakingDataReady, totalLocked } = useSelector(accountStakingSelector);

  let totalWorth = balance ? new BigNumber(balance) : new BigNumber(0);
  if (balance && stakingDataReady) {
    totalWorth = totalWorth.plus(new BigNumber(totalLocked));
  }

  return (
    <CardItem className={cardItemClass} title='Value' icon={faDollarSign}>
      <div className='d-flex align-items-center'>
        {balance ? (
          <span className='me-2'>
            <UsdValue input={totalWorth.toString(10)} />
          </span>
        ) : (
          <>...</>
        )}
        {stakingDataReady && (
          <LockedAmountTooltip
            lockedDetails={[
              {
                label: 'Available Balance',
                value: <UsdValue input={balance} />
              },
              {
                label: 'Stake',
                value: (
                  <UsdValue input={new BigNumber(totalLocked).toString(10)} />
                )
              }
            ]}
          />
        )}
      </div>
    </CardItem>
  );
};
