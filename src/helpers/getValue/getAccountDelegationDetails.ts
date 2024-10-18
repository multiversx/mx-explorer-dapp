import BigNumber from 'bignumber.js';

import { ZERO } from 'appConstants';
import { AccountDelegationType } from 'types';

export const getAccountDelegationDetails = (
  delegation: AccountDelegationType[]
) => {
  if (delegation && delegation.length > 0) {
    const bNactive = delegation
      .map(({ userActiveStake }) => userActiveStake)
      .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber(ZERO));
    const bNclaimableRewards = delegation
      .map(({ claimableRewards }) => claimableRewards ?? ZERO)
      .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber(ZERO));
    const undelegatedAmounts = delegation
      .map(
        ({ userUndelegatedList }) =>
          userUndelegatedList?.map(({ amount }) => amount) ?? []
      )
      .reduce((a, b) => a.concat(b), []);
    const bNunstaked = undelegatedAmounts.reduce(
      (a, b) => new BigNumber(a).plus(b),
      new BigNumber(ZERO)
    );

    const activePlusUnStaked = bNactive.plus(bNunstaked);
    const bNlocked = activePlusUnStaked.plus(bNclaimableRewards);

    const show = bNlocked.isGreaterThan(0);

    return {
      active: bNactive,
      unstaked: bNunstaked,
      claimable: bNclaimableRewards,
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
