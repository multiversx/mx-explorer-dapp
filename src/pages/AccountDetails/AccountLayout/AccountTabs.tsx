import * as React from 'react';
import { NetworkLink } from 'components';
import { urlBuilder, useActiveRoute, isContract } from 'helpers';
import { accountsRoutes } from 'routes';

import { useSelector } from 'react-redux';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';

export const AccountTabs = () => {
  const activeRoute = useActiveRoute();

  const { address, code } = useSelector(accountSelector);
  const { adapter } = useSelector(activeNetworkSelector);

  const tokensRouteActive = adapter === 'api';

  return (
    <div className="account-tabs d-flex flex-row flex-wrap">
      <NetworkLink
        to={urlBuilder.accountDetails(address)}
        className={`tab-link me-3 me-lg-spacer ${
          activeRoute(accountsRoutes.accountDetails) ? 'active' : ''
        }`}
      >
        <h6>Transactions</h6>
      </NetworkLink>

      {tokensRouteActive && (
        <NetworkLink
          to={urlBuilder.accountDetailsTokens(address)}
          className={`tab-link me-3 me-lg-spacer ${
            activeRoute(accountsRoutes.accountTokens) ? 'active' : ''
          }`}
        >
          <h6>ESDT Tokens</h6>
        </NetworkLink>
      )}

      <NetworkLink
        to={urlBuilder.accountDetailsNfts(address)}
        className={`tab-link me-3 me-lg-spacer ${
          activeRoute(accountsRoutes.accountNfts) ? 'active' : ''
        }`}
      >
        <h6>NFTs</h6>
      </NetworkLink>

      {!isContract(address) && (
        <NetworkLink
          to={urlBuilder.accountDetailsStaking(address)}
          className={`tab-link me-3 me-lg-spacer ${
            activeRoute(accountsRoutes.accountStaking) ? 'active' : ''
          }`}
        >
          <h6>Staking</h6>
        </NetworkLink>
      )}

      <NetworkLink
        to={urlBuilder.accountDetailsAnalytics(address)}
        className={`tab-link me-3 me-lg-spacer ${
          activeRoute(accountsRoutes.accountAnalytics) ? 'active' : ''
        }`}
      >
        <h6>Analytics</h6>
      </NetworkLink>

      {!code && (
        <NetworkLink
          to={urlBuilder.accountDetailsContracts(address)}
          className={`tab-link me-3 me-lg-spacer ${
            activeRoute(accountsRoutes.accountContracts) ? 'active' : ''
          }`}
        >
          <h6>Smart Contracts</h6>
        </NetworkLink>
      )}

      {code && (
        <NetworkLink
          to={urlBuilder.accountDetailsContractCode(address)}
          className={`tab-link ${activeRoute(accountsRoutes.accountCode) ? 'active' : ''}`}
        >
          <h6>Code</h6>
        </NetworkLink>
      )}
    </div>
  );
};
