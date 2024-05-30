import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Loader, PageState } from 'components';
import { useFetchAccountStakingDetails } from 'hooks';
import { faChartPie } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';

import { accountStakingSelector } from 'redux/selectors';

import { AccountDelegation } from './components/AccountDelegation';
import { AccountLegacyDelegation } from './components/AccountLegacyDelegation';
import { AccountStake } from './components/AccountStake';
import { DonutChart } from './components/DonutChart';

export const AccountStaking = () => {
  const { fetchAccountStakingDetails } = useFetchAccountStakingDetails();
  const { hash: address } = useParams();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const stakingDetails = useSelector(accountStakingSelector);
  const {
    address: stateAddress,
    providerDataReady,
    stakingDataReady,
    delegation,
    delegationProviders,
    stake,
    delegationLegacy,
    delegationLegacyIdentity,
    showDelegation,
    showDelegationLegacy,
    showStake
  } = stakingDetails;

  const displayDelegation = delegation
    ? delegation.filter(
        (delegation) =>
          delegation.userActiveStake !== '0' ||
          delegation.claimableRewards !== '0' ||
          (delegation.userUndelegatedList &&
            delegation.userUndelegatedList?.length > 0)
      )
    : [];

  const needsData = address && address !== stateAddress;
  const hasStaking = showDelegation || showDelegationLegacy || showStake;
  const isReady =
    providerDataReady &&
    stakingDataReady &&
    ((needsData && dataReady) || !needsData);

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
            {hasStaking ? (
              <>
                <div className='col-lg-5 ps-lg-0 d-flex flex-column'>
                  <div className='px-spacer py-3 staking-chart-title'>
                    Staking Chart
                  </div>
                  <div className='staking-chart-holder'>
                    <DonutChart
                      stakingDetails={stakingDetails}
                      providers={delegationProviders}
                    />
                  </div>
                </div>
                <div className='col-lg-7 pe-lg-0 order-lg-first'>
                  {displayDelegation.length > 0 && (
                    <div className='account-delegation stake-container'>
                      <div className='px-spacer py-3 delegation-title'>
                        Staking List
                      </div>
                      <div className='d-flex flex-column staking-list'>
                        {displayDelegation.map((delegation, i) => {
                          const provider = delegationProviders?.find(
                            ({ provider }) => delegation.contract === provider
                          );
                          return provider ? (
                            <AccountDelegation
                              delegation={delegation}
                              provider={provider}
                              key={i}
                            />
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  {delegationLegacy && showDelegationLegacy && (
                    <div className='account-legacy-delegation stake-container'>
                      <div className='px-spacer py-3 delegation-title'>
                        Legacy Delegation
                      </div>

                      <AccountLegacyDelegation
                        delegationLegacy={delegationLegacy}
                        identity={delegationLegacyIdentity}
                      />
                    </div>
                  )}
                  {stake && showStake && (
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
