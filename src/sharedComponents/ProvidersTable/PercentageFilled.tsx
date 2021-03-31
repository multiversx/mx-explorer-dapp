import * as React from 'react';
import { BigNumber } from 'bignumber.js';
import { nominate } from 'helpers';

interface PercentageFilledType {
  stake: string;
  delegationCap: string;
}

export const getPercentageFilled = (stake: string, delegationCap: string) => {
  const bnStake = new BigNumber(nominate(String(stake)));
  const bnDelegationCap = new BigNumber(nominate(String(delegationCap)));
  const percentageBn = bnStake.multipliedBy(100).dividedToIntegerBy(bnDelegationCap);
  const isLessThanOne = bnDelegationCap.minus(bnStake).isLessThan(1);

  return percentageBn.isNaN() ? 'Infinity' : isLessThanOne ? '100' : percentageBn.toString(10);
};

const PercentageFilled = ({ stake, delegationCap }: PercentageFilledType) => {
  const bnDelegationCap = new BigNumber(nominate(String(delegationCap)));
  const percentage = getPercentageFilled(stake, delegationCap);

  return bnDelegationCap.isGreaterThan(0) ? <>{percentage}%</> : <>Uncapped</>;
};

export default PercentageFilled;
