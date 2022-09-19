import React from 'react';
import { faChartPie } from '@fortawesome/pro-solid-svg-icons/faChartPie';

import AccountTabs from '../AccountLayout/AccountTabs';
import AccountDelegation from './AccountDelegation';
import AccountLegacyDelegation from './AccountLegacyDelegation';
import AccountStake from './AccountStake';

import { Loader, PageState } from 'sharedComponents';

import useFetchProvidersDetails from 'helpers/useFetchProvidersDetails';
import useFetchStakingDetails from 'helpers/useFetchStakingDetails';

const AccountStaking = () => {
  const { show, delegation, stake, delegationLegacy } = useFetchStakingDetails();
  const { providers, elrondNodes, dataReady } = useFetchProvidersDetails();

  const shownDelegations = delegation
    ? delegation.filter(
        (delegation) =>
          delegation.userActiveStake !== '0' ||
          delegation.claimableRewards !== '0' ||
          delegation.userUndelegatedList?.length > 0
      )
    : [];

  const showLegacyDelegation =
    delegationLegacy &&
    (delegationLegacy.claimableRewards !== '0' ||
      delegationLegacy.userWaitingStake !== '0' ||
      delegationLegacy.userActiveStake !== '0');

  const showStake =
    stake &&
    (stake?.totalStaked !== '0' || (stake?.unstakedTokens && stake.unstakedTokens.length > 0));

  const isReady = show && dataReady;
  const hasStaking = shownDelegations.length > 0 || showLegacyDelegation || showStake;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
        </div>
      </div>
      <div className="account-staking card-body p-0">
        {!isReady && <Loader dataTestId="stakingLoader" />}
        {isReady && (
          <div className="row">
            <div className="col-lg-7 pr-lg-0 border-right">
              {hasStaking ? (
                <>
                  {shownDelegations.length > 0 && (
                    <div className="account-delegation">
                      <div className="px-spacer py-3 border-bottom bg-light">Staking</div>
                      {shownDelegations.map((delegation, i) => {
                        const provider = providers.find(
                          ({ provider }) => delegation.contract === provider
                        );
                        return provider ? (
                          <AccountDelegation delegation={delegation} provider={provider} key={i} />
                        ) : null;
                      })}
                    </div>
                  )}
                  {delegationLegacy && showLegacyDelegation && (
                    <div
                      className={`account-legacy-delegation ${
                        shownDelegations.length > 0 ? 'border-top' : ''
                      }`}
                    >
                      <div className="px-spacer py-3 border-bottom bg-light">Legacy Delegation</div>

                      <AccountLegacyDelegation
                        delegationLegacy={delegationLegacy}
                        elrondNodes={elrondNodes}
                      />
                    </div>
                  )}
                  {stake && showStake && (
                    <div className="account-legacy-delegation">
                      <div className="px-spacer py-3 border-bottom bg-light">
                        Stake <span className="text-secondary">(Validation)</span>
                      </div>
                      <AccountStake stake={stake} />
                    </div>
                  )}
                </>
              ) : (
                <PageState
                  icon={faChartPie}
                  title="No Staking"
                  className="py-spacer my-auto"
                  dataTestId="errorScreen"
                />
              )}
            </div>
            <div className="col-lg-5"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountStaking;
