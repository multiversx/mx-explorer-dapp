import { BigNumber } from 'bignumber.js';
import { formatBigNumber, nominate } from 'helpers';

export const hasDelegationCap = (delegationCap: string) => {
  const bnDelegationCap = new BigNumber(delegationCap);
  return bnDelegationCap.isGreaterThan(0);
};

export const getPercentageFilled = (locked: string, delegationCap: string) => {
  const minDelegation = nominate('1'); // 1 EGLD
  const bnLocked = new BigNumber(locked);
  const bnDelegationCap = new BigNumber(delegationCap);

  if (hasDelegationCap(delegationCap)) {
    const isOverMinimum = bnDelegationCap
      .minus(bnLocked)
      .isGreaterThanOrEqualTo(minDelegation);

    const filled = bnLocked.multipliedBy(100).dividedBy(bnDelegationCap);
    const filledPercent = formatBigNumber(filled);

    return isOverMinimum ? filledPercent : '100';
  }

  return 'Infinity';
};
