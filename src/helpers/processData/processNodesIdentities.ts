import { IdentityType } from 'types/node.types';

export const processNodesIdentities = (data: IdentityType[]) => {
  const identitiesList: IdentityType[] = [];
  let overallStakePercent = 0;

  data.forEach((identity: IdentityType) => {
    if (!identity.stake || !identity.validators) {
      return;
    }
    identitiesList.push({ ...identity, overallStakePercent });
    overallStakePercent = overallStakePercent + identity.stakePercent;
  });

  return identitiesList;
};
