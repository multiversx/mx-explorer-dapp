import BigNumber from 'bignumber.js';

import { ZERO } from 'appConstants';
import { AccountStakeType } from 'types';

export const getAccountValidatorStakeDetails = (stake: AccountStakeType) => {
  if (stake) {
    const bNactive = new BigNumber(stake.totalStaked ?? ZERO);
    const bNunstaked =
      stake.unstakedTokens && stake.unstakedTokens.length > 0
        ? stake.unstakedTokens
            .map(({ amount }) => amount)
            .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber(ZERO))
        : new BigNumber(ZERO);

    const bNlocked = bNactive.plus(bNunstaked);
    const show = bNlocked.isGreaterThan(0);

    return {
      active: bNactive,
      unstaked: bNunstaked,
      claimable: new BigNumber(ZERO),
      locked: bNlocked,
      show
    };
  }

  return {
    active: new BigNumber(ZERO),
    unstaked: new BigNumber(ZERO),
    claimable: new BigNumber(ZERO),
    locked: new BigNumber(ZERO),
    show: false
  };
};
