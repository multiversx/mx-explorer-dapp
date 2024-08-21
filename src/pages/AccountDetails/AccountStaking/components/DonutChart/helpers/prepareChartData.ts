import BigNumber from 'bignumber.js';

import { ZERO } from 'appConstants';
import { DECIMALS, DIGITS } from 'config';
import { formatAmount, truncateMiddle } from 'helpers';
import { AccountStakingSliceType } from 'types/account.types';

interface DonutChartDataType {
  name: string;
  value: number;
  identifier?: string;
  displayValue?: number;
}

export const prepareChartData = ({
  stakingDetails
}: {
  stakingDetails: AccountStakingSliceType;
}): DonutChartDataType[] => {
  const {
    showDelegation,
    showValidatorStake,
    showLegacyDelegation,

    lockedLegacyDelegation,
    lockedValidatorStake,

    delegation,
    delegationProviders,

    accountStakingFetched
  } = stakingDetails;

  const defaultData = [{ name: 'No Staking', value: 1, displayValue: 0 }];

  if (accountStakingFetched) {
    const chartData: DonutChartDataType[] = [];

    if (showDelegation && delegation && delegation.length > 0) {
      delegation.forEach((delegation) => {
        const provider = delegationProviders.find(
          ({ provider }) => delegation.contract === provider
        );
        if (provider) {
          const {
            userActiveStake,
            claimableRewards,
            userUnBondable,
            userUndelegatedList
          } = delegation;

          const undelegatedAmounts =
            userUndelegatedList && userUndelegatedList.length > 0
              ? userUndelegatedList.map(({ amount }) => amount)
              : [];
          const bNtotalUserUnStakedValue = undelegatedAmounts.reduce(
            (a, b) => new BigNumber(a).plus(b),
            new BigNumber(ZERO)
          );

          const bNLocked = new BigNumber(userActiveStake)
            .plus(claimableRewards)
            .plus(userUnBondable)
            .plus(bNtotalUserUnStakedValue);

          const amount = formatAmount({
            input: bNLocked.toString(10),
            decimals: DECIMALS,
            digits: DIGITS,
            showLastNonZeroDecimal: false
          });

          chartData.push({
            name:
              provider?.identityInfo?.name ??
              truncateMiddle(provider.provider, 20),
            identifier: provider?.identity ?? provider.provider,
            value: Number(amount)
          });
        }
      });
    }
    if (showLegacyDelegation && lockedLegacyDelegation) {
      const amount = formatAmount({
        input: lockedLegacyDelegation,
        decimals: DECIMALS,
        digits: DIGITS,
        showLastNonZeroDecimal: false
      });
      chartData.push({
        name: 'MultiversX Legacy Delegation',
        identifier: 'multiversx',
        value: Number(amount)
      });
    }
    if (showValidatorStake && lockedValidatorStake) {
      const amount = formatAmount({
        input: lockedValidatorStake,
        decimals: DECIMALS,
        digits: DIGITS,
        showLastNonZeroDecimal: false
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
