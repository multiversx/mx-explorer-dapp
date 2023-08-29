import { BigNumber } from 'bignumber.js';

import { Denominate } from 'components';
import { nominate } from 'helpers';

export const DelegationCap = ({ delegationCap }: { delegationCap: string }) => {
  const bnDelegationCap = new BigNumber(nominate(String(delegationCap)));

  return bnDelegationCap.isGreaterThan(0) ? (
    <Denominate value={delegationCap} />
  ) : (
    <>Uncapped</>
  );
};
