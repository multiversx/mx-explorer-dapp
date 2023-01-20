import * as React from 'react';
import { NetworkLink } from 'sharedComponents';
import { urlBuilder, useActiveRoute, isContract } from 'helpers';
import { useGlobalState } from 'context';
import { accountsRoutes } from 'routes';

const AccountTabs = () => {
  const activeRoute = useActiveRoute();
  const { accountDetails, activeNetwork } = useGlobalState();
  const tokensRouteActive = activeNetwork.adapter === 'api';

  return (
    <div className="account-tabs d-flex flex-row flex-wrap">
      <NetworkLink
        to={urlBuilder.accountDetails(accountDetails.address)}
        className={`tab-link mr-3 mr-lg-spacer ${
          activeRoute(accountsRoutes.accountDetails) ? 'active' : ''
        }`}
      >
        <h6>Transactions</h6>
      </NetworkLink>

      {tokensRouteActive && (
        <NetworkLink
          to={urlBuilder.accountDetailsTokens(accountDetails.address)}
          className={`tab-link mr-3 mr-lg-spacer ${
            activeRoute(accountsRoutes.accountTokens) ? 'active' : ''
          }`}
        >
          <h6>ESDT Tokens</h6>
        </NetworkLink>
      )}

      <NetworkLink
        to={urlBuilder.accountDetailsNfts(accountDetails.address)}
        className={`tab-link mr-3 mr-lg-spacer ${
          activeRoute(accountsRoutes.accountNfts) ? 'active' : ''
        }`}
      >
        <h6>NFTs</h6>
      </NetworkLink>

      {!isContract(accountDetails.address) && (
        <NetworkLink
          to={urlBuilder.accountDetailsStaking(accountDetails.address)}
          className={`tab-link mr-3 mr-lg-spacer ${
            activeRoute(accountsRoutes.accountStaking) ? 'active' : ''
          }`}
        >
          <h6>Staking</h6>
        </NetworkLink>
      )}

      <NetworkLink
        to={urlBuilder.accountDetailsAnalytics(accountDetails.address)}
        className={`tab-link mr-3 mr-lg-spacer ${
          activeRoute(accountsRoutes.accountAnalytics) ? 'active' : ''
        }`}
      >
        <h6>Analytics</h6>
      </NetworkLink>

      {!accountDetails.code && (
        <NetworkLink
          to={urlBuilder.accountDetailsContracts(accountDetails.address)}
          className={`tab-link mr-3 mr-lg-spacer ${
            activeRoute(accountsRoutes.accountContracts) ? 'active' : ''
          }`}
        >
          <h6>Smart Contracts</h6>
        </NetworkLink>
      )}

      {accountDetails.code && (
        <NetworkLink
          to={urlBuilder.accountDetailsContractCode(accountDetails.address)}
          className={`tab-link ${activeRoute(accountsRoutes.accountCode) ? 'active' : ''}`}
        >
          <h6>Code</h6>
        </NetworkLink>
      )}
    </div>
  );
};

export default AccountTabs;
