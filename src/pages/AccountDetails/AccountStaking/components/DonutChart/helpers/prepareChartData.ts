import BigNumber from 'bignumber.js';

import { DECIMALS, DIGITS } from 'config';
import { formatAmount, truncateMiddle } from 'helpers';
import { ProviderType } from 'types';
import { AccountStakingSliceType } from 'types/account.types';

interface DonutChartDataType {
  name: string;
  value: number;
  identifier?: string;
  displayValue?: number;
}

export const prepareChartData = ({
  stakingDetails,
  providers
}: {
  stakingDetails: AccountStakingSliceType;
  providers: ProviderType[];
}): DonutChartDataType[] => {
  const {
    accountStakingFetched,
    delegation,
    stake,
    delegationLegacy,
    showStake,
    showDelegationLegacy,
    totalLegacyDelegation,
    totalStaked
  } = stakingDetails;

  const defaultData = [{ name: 'No Staking', value: 1, displayValue: 0 }];

  if (accountStakingFetched) {
    const bNtotalLegacyDelegation = new BigNumber(totalLegacyDelegation);
    const bNtotalStaked = new BigNumber(totalStaked);

    const chartData: DonutChartDataType[] = [];
    const displayDelegations = delegation
      ? delegation.filter(
          (delegation) =>
            delegation.userActiveStake !== '0' ||
            delegation.claimableRewards !== '0' ||
            (delegation.userUndelegatedList &&
              delegation.userUndelegatedList.length > 0)
        )
      : [];
    if (displayDelegations.length > 0) {
      displayDelegations.forEach((delegation) => {
        const provider = providers.find(
          ({ provider }) => delegation.contract === provider
        );
        if (provider) {
          const { userActiveStake, claimableRewards, userUnBondable } =
            delegation;
          const bNtotalLocked = new BigNumber(userActiveStake)
            .plus(claimableRewards)
            .plus(userUnBondable);

          const amount = formatAmount({
            input: bNtotalLocked.toString(10),
            decimals: DECIMALS,
            digits: DIGITS,
            showLastNonZeroDecimal: false,
            addCommas: false
          });

          chartData.push({
            name:
              provider?.identityDetails?.name ??
              truncateMiddle(provider.provider, 20),
            identifier: provider?.identity ?? provider.provider,
            value: Number(amount)
          });
        }
      });
    }
    if (showDelegationLegacy && delegationLegacy) {
      const amount = formatAmount({
        input: bNtotalLegacyDelegation.toString(10),
        decimals: DECIMALS,
        digits: DIGITS,
        showLastNonZeroDecimal: false,
        addCommas: false
      });
      chartData.push({
        name: 'MultiversX Legacy Delegation',
        identifier: 'multiversx',
        value: Number(amount)
      });
    }
    if (showStake && stake) {
      const amount = formatAmount({
        input: bNtotalStaked.toString(10),
        decimals: DECIMALS,
        digits: DIGITS,
        showLastNonZeroDecimal: false,
        addCommas: false
      });
      chartData.push({
        name: 'Staked Validator Nodes',
        identifier: 'defaultstaked',
        value: Number(amount)
      });
    }
    return chartData.length > 0 ? chartData : defaultData;
  }

  return defaultData;
};
