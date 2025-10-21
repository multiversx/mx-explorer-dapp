import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Loader, PageState, SelectFilter, Sort } from 'components';
import { useFetchAccountStakingDetails, useGetSort } from 'hooks';
import { faChartPie } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { accountStakingSelector } from 'redux/selectors';
import { AccountStakingSortingEnum, SortOrderEnum } from 'types';

import { AccountDelegation } from './components/AccountDelegation';
import { AccountLegacyDelegation } from './components/AccountLegacyDelegation';
import { AccountStake } from './components/AccountStake';
import { DonutChart } from './components/DonutChart';
import { useGetDelegationList } from './hooks';

export const AccountStaking = () => {
  const { fetchAccountStakingDetails } = useFetchAccountStakingDetails();
  const { hash: address } = useParams();
  const { sort } = useGetSort();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const stakingDetails = useSelector(accountStakingSelector);
  const {
    address: stateAddress,

    showDelegation,
    showLegacyDelegation,
    showValidatorStake,
    showStakingDetails,

    delegation,
    stake,
    legacyDelegation,

    providerDataReady,
    delegationProviders,
    delegationLegacyIdentity,

    accountStakingFetched
  } = stakingDetails;

  const needsData = address && address !== stateAddress;

  const isReady =
    providerDataReady &&
    accountStakingFetched &&
    ((needsData && dataReady) || !needsData);

  const delegations = useGetDelegationList({ delegation, delegationProviders });

  const sortOptions = [
    {
      value: AccountStakingSortingEnum.staked,
      label: 'Amount Staked'
    },
    {
      value: AccountStakingSortingEnum.rewards,
      label: 'Claimable Rewards'
    },
    {
      value: AccountStakingSortingEnum.undelegated,
      label: 'Undelegated'
    },
    {
      value: AccountStakingSortingEnum.name,
      label: 'Name'
    },
    {
      value: AccountStakingSortingEnum.filled,
      label: '% Filled'
    },
    {
      value: AccountStakingSortingEnum.apr,
      label: 'APR'
    }
  ];

  useEffect(() => {
    if (needsData) {
      fetchAccountStakingDetails({ address }).then(
        ([delegationData, stakeData, delegationLegacyData]) => {
          setDataReady(
            delegationData.success &&
              stakeData.success &&
              delegationLegacyData.success
          );
        }
      );
    }
  }, [needsData]);

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
        </div>
      </div>
      <div className='account-staking card-body'>
        {isReady ? (
          <div className='row'>
            {accountStakingFetched && showStakingDetails ? (
              <>
                <div className='col-lg-5 ps-lg-0 d-flex flex-column'>
                  <div className='px-spacer py-3 staking-chart-title'>
                    Staking Chart
                  </div>
                  <div className='staking-chart-holder'>
                    <DonutChart />
                  </div>
                </div>
                <div className='col-lg-7 pe-lg-0 order-lg-first'>
                  {showDelegation && delegations.length > 0 && (
                    <div className='account-delegation stake-container'>
                      <div className='px-spacer initial-title delegation-title d-flex flex-wrap gap-2 align-items-center justify-content-between'>
                        Staking List{' '}
                        <div className='d-flex align-items-center'>
                          <SelectFilter
                            className='stake-values-sort'
                            name='senderShard-filter'
                            options={sortOptions}
                            filter={'sort'}
                            placeholder='Sort'
                            showAllPlaceholder='Default'
                          />
                          <Sort
                            id={sort ?? 'default'}
                            text={''}
                            defaultOrder={SortOrderEnum.desc}
                            defaultActive={false}
                            keepId
                          />
                        </div>
                      </div>
                      <div className='d-flex flex-column staking-list'>
                        {delegations.map(
                          ({ delegationDetails, providerDetails }, i) => (
                            <AccountDelegation
                              delegation={delegationDetails}
                              provider={providerDetails}
                              key={i}
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {showLegacyDelegation && legacyDelegation && (
                    <div className='account-legacy-delegation stake-container'>
                      <div className='px-spacer py-3 delegation-title'>
                        Legacy Delegation
                      </div>

                      <AccountLegacyDelegation
                        legacyDelegation={legacyDelegation}
                        identity={delegationLegacyIdentity}
                      />
                    </div>
                  )}
                  {showValidatorStake && stake && (
                    <div className='account-stake stake-container'>
                      <div className='px-spacer py-3 delegation-title'>
                        Stake{' '}
                        <span className='text-neutral-400'>(Validation)</span>
                      </div>
                      <AccountStake stake={stake} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className='col-12'>
                <PageState icon={faChartPie} title='No Staking' isError />
              </div>
            )}
          </div>
        ) : (
          <Loader data-testid='stakingLoader' />
        )}
      </div>
    </div>
  );
};
