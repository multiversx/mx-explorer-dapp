import * as React from 'react';
import { NetworkLink } from 'sharedComponents';
import { urlBuilder, useActiveRoute } from 'helpers';
import { useGlobalState } from 'context';
import { accountsRoutes } from 'routes';

const AccountTabs = () => {
  const activeRoute = useActiveRoute();
  const { accountDetails, activeNetwork } = useGlobalState();
  const tokensRouteActive = activeNetwork.adapter === 'api';

  return (
    <div className="account-tabs d-flex flex-row">
      <NetworkLink
        to={urlBuilder.accountDetails(accountDetails.address)}
        className={`tab-link mr-3 ${activeRoute(accountsRoutes.accountDetails) ? 'active' : ''}`}
      >
        <h6>Transactions</h6>
      </NetworkLink>

      {tokensRouteActive && (
        <NetworkLink
          to={urlBuilder.accountDetailsTokens(accountDetails.address)}
          className={`tab-link mx-3 ${activeRoute(accountsRoutes.accountTokens) ? 'active' : ''}`}
        >
          <h6>ESDT Tokens</h6>
        </NetworkLink>
      )}
      {accountDetails.code && (
        <NetworkLink
          to={urlBuilder.accountDetailsContractCode(accountDetails.address)}
          className={`tab-link ml-3 ${activeRoute(accountsRoutes.accountCode) ? 'active' : ''}`}
        >
          <h6>Code</h6>
        </NetworkLink>
      )}
    </div>
  );
};

export default AccountTabs;
