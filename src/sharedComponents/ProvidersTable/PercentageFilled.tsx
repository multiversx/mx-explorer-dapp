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

  const isOverMinimum = bnDelegationCap
    .minus(bnLocked)
    .isGreaterThanOrEqualTo(nominate(String(minDelegation)));

  return isOverMinimum ? bnLocked.multipliedBy(100).dividedBy(bnDelegationCap).toFixed(1) : '100';
};

export const hasDelegationCap = (delegationCap: string) => {
  const bnDelegationCap = new BigNumber(delegationCap);
  return bnDelegationCap.isGreaterThan(0);
};

const PercentageFilled = ({ locked, delegationCap }: PercentageFilledType) => {
  const percentage = getPercentageFilled(locked, delegationCap);
  return hasDelegationCap(delegationCap) ? <>{percentage}%</> : <>Uncapped</>;
};

export default PercentageFilled;
