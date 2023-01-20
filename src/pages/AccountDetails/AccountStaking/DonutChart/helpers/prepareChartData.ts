import BigNumber from 'bignumber.js';

import { AccountStakingDetailsType } from 'context/state';

import denominate from 'sharedComponents/Denominate/denominate';
import { denomination, decimals } from 'appConfig';
import { truncateMiddle } from 'helpers';
import { ProviderType } from 'helpers/types';

interface DonutChartDataType {
  name: string;
  value: number;
  identifier?: string;
  displayValue?: number;
}

const prepareChartData = ({
  stakingDetails,
  providers,
}: {
  stakingDetails: AccountStakingDetailsType;
  providers: ProviderType[];
}): DonutChartDataType[] => {
  const {
    stakingDataReady,
    delegation,
    stake,
    delegationLegacy,
    showStake,
    showDelegationLegacy,
    bNtotalLegacyDelegation,
    bNtotalStaked,
  } = stakingDetails;

  const defaultData = [{ name: 'No Staking', value: 1, displayValue: 0 }];

  if (stakingDataReady) {
    const chartData: DonutChartDataType[] = [];
    const displayDelegations = delegation
      ? delegation.filter(
          (delegation) =>
            delegation.userActiveStake !== '0' ||
            delegation.claimableRewards !== '0' ||
            (delegation.userUndelegatedList && delegation.userUndelegatedList.length > 0)
        )
      : [];
    if (displayDelegations.length > 0) {
      displayDelegations.forEach((delegation) => {
        const provider = providers.find(({ provider }) => delegation.contract === provider);
        if (provider) {
          const { userActiveStake, claimableRewards, userUnBondable } = delegation;
          const bNtotalLocked = new BigNumber(userActiveStake)
            .plus(claimableRewards)
            .plus(userUnBondable);

          const amount = denominate({
            input: bNtotalLocked.toString(10),
            denomination,
            decimals,
            showLastNonZeroDecimal: false,
            addCommas: false,
          });

          chartData.push({
            name: provider?.identityDetails?.name ?? truncateMiddle(provider.provider, 20),
            identifier: provider?.identity ?? provider.provider,
            value: Number(amount),
          });
        }
      });
    }
    if (showDelegationLegacy && delegationLegacy) {
      const amount = denominate({
        input: bNtotalLegacyDelegation.toString(10),
        denomination,
        decimals,
        showLastNonZeroDecimal: false,
        addCommas: false,
      });
      chartData.push({
        name: 'MultiversX Legacy Delegation',
        identifier: 'multiversx',
        value: Number(amount),
      });
    }
    if (showStake && stake) {
      const amount = denominate({
        input: bNtotalStaked.toString(10),
        denomination,
        decimals,
        showLastNonZeroDecimal: false,
        addCommas: false,
      });
      chartData.push({
        name: 'Staked Validator Nodes',
        identifier: 'defaultstaked',
        value: Number(amount),
      });
    }
    return chartData.length > 0 ? chartData : defaultData;
  }

  return defaultData;
};

export default prepareChartData;
