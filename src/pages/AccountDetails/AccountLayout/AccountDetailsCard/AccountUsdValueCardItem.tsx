import React from 'react';
import { faDollarSign } from '@fortawesome/pro-solid-svg-icons/faDollarSign';
import { CardItem, LockedAmountTooltip, UsdValue } from 'components';
import { useGlobalState } from 'context';
import BigNumber from 'bignumber.js';

const AccountUsdValueCardItem = ({ cardItemClass }: { cardItemClass: string }) => {
  const {
    accountDetails: { balance },
    accountStakingDetails: { stakingDataReady, bNtotalLocked },
  } = useGlobalState();

  let totalWorth = balance ? new BigNumber(balance) : new BigNumber(0);
  if (balance && stakingDataReady) {
    totalWorth = totalWorth.plus(bNtotalLocked);
  }

  return (
    <CardItem className={cardItemClass} title="Value" icon={faDollarSign}>
      <div className="d-flex align-items-center">
        {balance ? (
          <span className="mr-2">
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
                value: <UsdValue input={balance} />,
              },
              {
                label: 'Stake',
                value: <UsdValue input={bNtotalLocked.toString(10)} />,
              },
            ]}
          />
        )}
      </div>
    </CardItem>
  );
};

export default AccountUsdValueCardItem;
