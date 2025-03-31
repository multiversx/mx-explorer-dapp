import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { ZERO } from 'appConstants';
import { getPercentageFilled } from 'helpers';
import { useGetSort } from 'hooks';
import {
  AccountDelegationType,
  AccountUndelegationType,
  ProviderType,
  SortOrderEnum
} from 'types';

import { AccountStakingSortingEnum } from '../AccountStaking';

interface UseGetDelegationListPropsType {
  delegation?: AccountDelegationType[];
  delegationProviders?: ProviderType[];
}

const getTotalUndelegatedAmounts = (
  userUndelegatedList: AccountUndelegationType[] = []
) => {
  if (!(userUndelegatedList && userUndelegatedList.length > 0)) {
    return new BigNumber(ZERO);
  }

  return userUndelegatedList
    .map(({ amount }) => amount)
    .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber(ZERO));
};

export const useGetDelegationList = ({
  delegation,
  delegationProviders
}: UseGetDelegationListPropsType) => {
  const { sort, order } = useGetSort();

  const delegations = useMemo(() => {
    const sortParams = order === SortOrderEnum.asc ? [1, -1] : [-1, 1];

    if (!delegation) {
      return [];
    }

    const delegationList = delegation.map((delegationDetails) => {
      const providerDetails = delegationProviders?.find(
        ({ provider }) => delegationDetails.contract === provider
      );
      return {
        delegationDetails,
        providerDetails
      };
    });

    switch (sort) {
      case AccountStakingSortingEnum.staked:
        return delegationList.sort((a, b) =>
          new BigNumber(a.delegationDetails.userActiveStake).isGreaterThan(
            b.delegationDetails.userActiveStake
          )
            ? sortParams[0]
            : sortParams[1]
        );

      case AccountStakingSortingEnum.rewards:
        return delegationList.sort((a, b) =>
          new BigNumber(a.delegationDetails.claimableRewards).isGreaterThan(
            b.delegationDetails.claimableRewards
          )
            ? sortParams[0]
            : sortParams[1]
        );

      case AccountStakingSortingEnum.undelegated:
        return delegationList.sort((a, b) => {
          const aUndelegation = getTotalUndelegatedAmounts(
            a.delegationDetails.userUndelegatedList
          );

          const bUndelegation = getTotalUndelegatedAmounts(
            b.delegationDetails.userUndelegatedList
          );

          return aUndelegation.isGreaterThan(bUndelegation)
            ? sortParams[0]
            : sortParams[1];
        });

      case AccountStakingSortingEnum.name:
        return delegationList.sort((a, b) => {
          if (!a.providerDetails || !b.providerDetails) {
            return 0;
          }

          const aProvider =
            a?.providerDetails?.identityInfo?.name ??
            a?.providerDetails.provider;
          const bProvider =
            b?.providerDetails?.identityInfo?.name ??
            b?.providerDetails.provider;

          return aProvider > bProvider ? sortParams[0] : sortParams[1];
        });

      case AccountStakingSortingEnum.filled:
        return delegationList.sort((a, b) => {
          if (!a.providerDetails || !b.providerDetails) {
            return 0;
          }

          const aFilled = getPercentageFilled(
            a.providerDetails.locked,
            a.providerDetails.delegationCap
          );
          const bFilled = getPercentageFilled(
            b.providerDetails.locked,
            b.providerDetails.delegationCap
          );
          return parseFloat(aFilled) > parseFloat(bFilled)
            ? sortParams[0]
            : sortParams[1];
        });

      case AccountStakingSortingEnum.apr:
        return delegationList.sort((a, b) => {
          if (!a.providerDetails || !b.providerDetails) {
            return 0;
          }

          return new BigNumber(a.providerDetails.apr).isGreaterThan(
            b.providerDetails.apr
          )
            ? sortParams[0]
            : sortParams[1];
        });

      default:
        return delegationList;
    }
  }, [sort, order, delegation, delegationProviders]);

  return delegations;
};
