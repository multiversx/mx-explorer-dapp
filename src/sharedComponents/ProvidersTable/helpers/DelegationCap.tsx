import * as React from 'react';
import { BigNumber } from 'bignumber.js';
import { nominate } from 'helpers';
import { Denominate } from 'sharedComponents';

const DelegationCap = ({ maxDelegationCap }: { maxDelegationCap: string }) => {
  const bnmaxDelegationCap = new BigNumber(nominate(String(maxDelegationCap)));

  return bnmaxDelegationCap.isGreaterThan(0) ? (
    <Denominate value={maxDelegationCap} />
  ) : (
    <>Uncapped</>
  );
};

export default DelegationCap;
