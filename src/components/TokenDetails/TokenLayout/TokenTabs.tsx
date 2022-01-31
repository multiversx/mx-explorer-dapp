import * as React from 'react';
import { NetworkLink } from 'sharedComponents';
import { urlBuilder, useActiveRoute } from 'helpers';
import { useGlobalState } from 'context';
import { tokensRoutes } from 'routes';

const TokenTabs = () => {
  const activeRoute = useActiveRoute();
  const { tokenDetails } = useGlobalState();

  return (
    <div className="account-tabs d-flex flex-row">
      <NetworkLink
        to={urlBuilder.tokenDetails(tokenDetails.identifier)}
        className={`tab-link mr-3 ${activeRoute(tokensRoutes.tokenDetails) ? 'active' : ''}`}
      >
        <h6>Transactions</h6>
      </NetworkLink>

      <NetworkLink
        to={urlBuilder.tokenDetailsAccounts(tokenDetails.identifier)}
        className={`tab-link mx-3 ${
          activeRoute(tokensRoutes.tokenDetailsAccounts) ? 'active' : ''
        }`}
      >
        <h6>Accounts</h6>
      </NetworkLink>

      <NetworkLink
        to={urlBuilder.tokenDetailsRoles(tokenDetails.identifier)}
        className={`tab-link mx-3 ${activeRoute(tokensRoutes.tokenDetailsRoles) ? 'active' : ''}`}
      >
        <h6>Roles</h6>
      </NetworkLink>
    </div>
  );
};

export default TokenTabs;
