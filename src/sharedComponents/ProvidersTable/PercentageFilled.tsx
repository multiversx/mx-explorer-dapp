import * as React from 'react';
import { BigNumber } from 'bignumber.js';
import { nominate } from 'helpers';

interface PercentageFilledType {
  totalActiveStake: string;
  maxDelegationCap: string;
}

export const getPercentageFilled = (totalActiveStake: string, maxDelegationCap: string) => {
  const bnTotalActiveStake = new BigNumber(nominate(String(totalActiveStake)));
  const bnmaxDelegationCap = new BigNumber(nominate(String(maxDelegationCap)));

  return bnTotalActiveStake.multipliedBy(100).dividedToIntegerBy(bnmaxDelegationCap).toString(10);
};

const PercentageFilled = ({ totalActiveStake, maxDelegationCap }: PercentageFilledType) => {
  const bnmaxDelegationCap = new BigNumber(nominate(String(maxDelegationCap)));
  const percentage = getPercentageFilled(totalActiveStake, maxDelegationCap);

  return bnmaxDelegationCap.isGreaterThan(0) ? <>{percentage}%</> : <>Uncapped</>;
};

export default PercentageFilled;
