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

  let bNtotalStaked = new BigNumber(0);
  let bNtotalDelegation = new BigNumber(0);
  let bNtotalLegacyDelegation = new BigNumber(0);
  let bNtotalLocked = new BigNumber(0);

  const bNClaimableRewards = new BigNumber(
    accountDetails.claimableRewards ? accountDetails.claimableRewards : 0
  );
  let bNtotalClaimable = bNClaimableRewards;

  const {
    stake,
    delegationLegacy,
    delegation,
    stakeFetched,
    delegationLegacyFetched,
    delegationFetched,
  } = lockedAmount;

  const show = stakeFetched && delegationLegacyFetched && delegationFetched;
  if (stake) {
    bNtotalStaked = new BigNumber(stake.totalStaked ? stake.totalStaked : 0);
  }
  if (delegationLegacy) {
    const bNuserActiveStake = new BigNumber(
      delegationLegacy.userActiveStake ? delegationLegacy.userActiveStake : 0
    );
    const bNuserWaitingStake = new BigNumber(
      delegationLegacy.userWaitingStake ? delegationLegacy.userWaitingStake : 0
    );
    bNtotalLegacyDelegation = new BigNumber(bNuserActiveStake.plus(bNuserWaitingStake));
  }

  if (delegation && delegation.length > 0) {
    const bNtotalUserActiveStake = delegation
      .map(({ userActiveStake }) => userActiveStake)
      .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber('0'));
    const bNtotalClaimableRewards = delegation
      .map(({ claimableRewards }) => claimableRewards || '0')
      .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber('0'));
    const undelegatedAmounts = delegation
      .map(({ userUndelegatedList }) => userUndelegatedList.map(({ amount }) => amount))
      .reduce((a, b) => a.concat(b), []);
    const bNtotalUserUnStakedValue = undelegatedAmounts.reduce(
      (a, b) => new BigNumber(a).plus(b),
      new BigNumber('0')
    );
    const activePlusUnStaked = bNtotalUserActiveStake.plus(bNtotalUserUnStakedValue);
    bNtotalDelegation = bNtotalClaimableRewards.plus(activePlusUnStaked);
    bNtotalClaimable = bNtotalClaimable.plus(bNtotalClaimableRewards);
  }
  if (stake && delegationLegacy && delegationLegacy) {
    bNtotalLocked = bNClaimableRewards
      .plus(bNtotalStaked)
      .plus(bNtotalLegacyDelegation)
      .plus(bNtotalDelegation);
  }

  return (
    <CardItem className={cardItemClass} title="Stake" icon={faLock}>
      <div className="d-flex align-items-center">
        {show ? (
          <span className="mr-2">
            <Denominate value={bNtotalLocked.toString(10)} />
          </span>
        ) : (
          <>...</>
        )}
        {show && (
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

export default LockedDetails;
