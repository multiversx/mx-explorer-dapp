import * as React from 'react';
import { BigNumber } from 'bignumber.js';
import { nominate } from 'helpers';

interface PercentageFilledType {
  locked: string;
  delegationCap: string;
}

export const getPercentageFilled = (locked: string, delegationCap: string) => {
  const minDelegation = 1;

  const bnLocked = new BigNumber(locked);
  const bnDelegationCap = new BigNumber(delegationCap);

  switch (true) {
    case hasDelegationCap(delegationCap):
      const isOverMinimum = bnDelegationCap
        .minus(bnLocked)
        .isGreaterThanOrEqualTo(nominate(String(minDelegation)));

      const filled = bnLocked
        .multipliedBy(100)
        .dividedBy(bnDelegationCap)
        .toFixed(4)
        .slice(0, -3);
      const filledPercent =
        filled === '100.0' ? '100' : filled === '0.0' ? '0' : filled;

      return isOverMinimum ? filledPercent : '100';

    default:
      return 'Infinity';
  }
};

export const hasDelegationCap = (delegationCap: string) => {
  const bnDelegationCap = new BigNumber(delegationCap);
  return bnDelegationCap.isGreaterThan(0);
};

export const PercentageFilled = ({
  locked,
  delegationCap
}: PercentageFilledType) => {
  const percentage = getPercentageFilled(locked, delegationCap);
  return hasDelegationCap(delegationCap) ? <>{percentage}%</> : <>Uncapped</>;
};
