import * as React from 'react';
import { NetworkLink } from 'sharedComponents';
import { urlBuilder, useActiveRoute, useIsTestnet } from 'helpers';
import { useGlobalState } from 'context';
import { accountsRoutes } from 'routes';

const AccountTabs = () => {
  // temporary
  const isStaging = process.env.REACT_APP_IS_STAGING;
  const isTestnet = useIsTestnet();
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

      {!(isTestnet || isStaging) && (
        <NetworkLink
          to={urlBuilder.accountDetailsScResults(accountDetails.address)}
          className={`tab-link mr-3 mr-lg-spacer ${
            activeRoute(accountsRoutes.accountScResults) ? 'active' : ''
          }`}
        >
          <h6>SC Results</h6>
        </NetworkLink>
      )}

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
