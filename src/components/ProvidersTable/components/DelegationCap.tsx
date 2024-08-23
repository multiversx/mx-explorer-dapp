import { BigNumber } from 'bignumber.js';

import { FormatAmount } from 'components';
import { parseAmount } from 'helpers';

export const DelegationCap = ({ delegationCap }: { delegationCap: string }) => {
  const bnDelegationCap = new BigNumber(parseAmount(String(delegationCap)));

  return bnDelegationCap.isGreaterThan(0) ? (
    <FormatAmount value={delegationCap} className='text-neutral-200' />
  ) : (
    <>Uncapped</>
  );
};
