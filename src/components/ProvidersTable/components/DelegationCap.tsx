import { BigNumber } from 'bignumber.js';

import { FormatAmount } from 'components';
import { nominate } from 'helpers';

export const DelegationCap = ({ delegationCap }: { delegationCap: string }) => {
  const bnDelegationCap = new BigNumber(nominate(String(delegationCap)));

  return bnDelegationCap.isGreaterThan(0) ? (
    <FormatAmount value={delegationCap} />
  ) : (
    <>Uncapped</>
  );
};
