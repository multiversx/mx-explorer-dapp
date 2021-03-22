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

  return bnmaxDelegationCap.isGreaterThan(0)
    ? bnTotalActiveStake.multipliedBy(100).dividedToIntegerBy(bnmaxDelegationCap).toString(10)
    : 'Uncapped';
};

const PercentageFilled = ({ totalActiveStake, maxDelegationCap }: PercentageFilledType) => {
  const percentage = getPercentageFilled(totalActiveStake, maxDelegationCap);

  return percentage !== 'Uncapped' ? <>{percentage}%</> : <>{percentage}</>;
};

export default PercentageFilled;
