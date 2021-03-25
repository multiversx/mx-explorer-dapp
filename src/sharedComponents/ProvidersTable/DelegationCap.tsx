import * as React from 'react';
import { BigNumber } from 'bignumber.js';
import { nominate } from 'helpers';
import { Denominate } from 'sharedComponents';

const DelegationCap = ({ delegationCap }: { delegationCap: string }) => {
  const bnDelegationCap = new BigNumber(nominate(String(delegationCap)));

  return bnDelegationCap.isGreaterThan(0) ? <Denominate value={delegationCap} /> : <>Uncapped</>;
};

export default DelegationCap;
