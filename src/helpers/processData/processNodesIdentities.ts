import BigNumber from 'bignumber.js';
import { IdentityType } from 'types/node.types';

export const processNodesIdentities = (identities: IdentityType[]) => {
  const identitiesList: IdentityType[] = [];
  let overallStakePercent = new BigNumber(0);
  let overallValidatorsPercent = new BigNumber(0);

  const totalValidators = identities
    .map(({ validators }) => validators || 0)
    .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber(0));

  const totalLocked = identities
    .map(({ locked }) => locked || 0)
    .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber(0));

  identities.forEach((identity: IdentityType) => {
    if (
      !identity.stake ||
      !identity.validators ||
      totalValidators.isLessThan(1)
    ) {
      return;
    }
    const validatorsPercent = new BigNumber(identity.validators)
      .dividedBy(totalValidators)
      .times(100);

    const stakePercent = new BigNumber(identity.locked)
      .dividedBy(totalLocked)
      .times(100);

    identitiesList.push({
      ...identity,
      stakePercent: stakePercent.toNumber(),
      overallStakePercent: overallStakePercent.toNumber(),
      validatorsPercent: validatorsPercent.toNumber(),
      overallValidatorsPercent: overallValidatorsPercent.toNumber()
    });

    overallStakePercent = overallStakePercent.plus(stakePercent);
    overallValidatorsPercent = overallValidatorsPercent.plus(validatorsPercent);
  });

  return identitiesList;
};
