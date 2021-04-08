import React from 'react';
import BigNumber from 'bignumber.js';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { useGlobalState } from 'context';
import { LockedAmountType } from './index';
import { CardItem, Denominate, LockedAmountTooltip } from 'sharedComponents';

const LockedDetails = ({
  lockedAmount,
  cardItemClass,
}: {
  lockedAmount: LockedAmountType;
  cardItemClass: string;
}) => {
  const { accountDetails } = useGlobalState();
  const bNClaimableRewards = new BigNumber(
    accountDetails.claimableRewards ? accountDetails.claimableRewards : 0
  );

  const {
    totalStaked,
    userActiveStake,
    // userDeferredPaymentStake,
    // userUnstakedStake,
    userWaitingStake,
    // userWithdrawOnlyStake,
  } = lockedAmount;

  const bNtotalStaked = new BigNumber(totalStaked ? totalStaked : 0);
  const bNuserActiveStake = new BigNumber(userActiveStake ? userActiveStake : 0);
  const bNuserWaitingStake = new BigNumber(userWaitingStake ? userWaitingStake : 0);
  const totalLocked = bNClaimableRewards
    .plus(bNtotalStaked)
    .plus(bNuserActiveStake)
    .plus(bNuserWaitingStake);

  const show = lockedAmount.delegationFetched && lockedAmount.stakeFetched;

  return (
    <CardItem className={cardItemClass} title="Locked" icon={faLock}>
      <div className="d-flex align-items-center">
        <span className="mr-2">
          {show ? <Denominate value={totalLocked.toString(10)} /> : <>...</>}
        </span>

        {show && (
          <LockedAmountTooltip
            lockedDetails={[
              { label: 'Stake', value: <Denominate value={bNtotalStaked.toString(10)} /> },
              {
                label: 'Active Delegation',
                value: <Denominate value={bNuserActiveStake.toString(10)} />,
              },
              {
                label: 'Waiting Delegation',
                value: <Denominate value={bNuserWaitingStake.toString(10)} />,
              },
              {
                label: 'Claimable Rewards',
                value: <Denominate value={bNClaimableRewards.toString(10)} />,
              },
            ]}
          />
        )}
      </div>
    </CardItem>
  );
};

export default LockedDetails;
