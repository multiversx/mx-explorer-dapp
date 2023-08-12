import React from 'react';
import { faDollarSign } from '@fortawesome/pro-solid-svg-icons';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { CardItem, LockedAmountTooltip, FormatUSD } from 'components';
import { DECIMALS } from 'config';
import { accountSelector, accountStakingSelector } from 'redux/selectors';

export const AccountUsdValueCardItem = ({
  cardItemClass
}: {
  cardItemClass: string;
}) => {
  const { account } = useSelector(accountSelector);
  const { balance } = account;
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
            <FormatUSD
              amount={totalWorth.toString(10)}
              decimals={DECIMALS}
              digits={2}
              showPrefix={false}
            />
          </span>
        ) : (
          <>...</>
        )}
        {stakingDataReady && (
          <LockedAmountTooltip
            lockedDetails={[
              {
                label: 'Available Balance',
                value: (
                  <FormatUSD
                    amount={balance}
                    decimals={DECIMALS}
                    digits={2}
                    showPrefix={false}
                  />
                )
              },
              {
                label: 'Stake',
                value: (
                  <FormatUSD
                    amount={new BigNumber(totalLocked).toString(10)}
                    decimals={DECIMALS}
                    digits={2}
                    showPrefix={false}
                  />
                )
              }
            ]}
          />
        )}
      </div>
    </CardItem>
  );
};
