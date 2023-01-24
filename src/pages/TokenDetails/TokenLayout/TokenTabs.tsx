import * as React from 'react';
import { useSelector } from 'react-redux';
import { NetworkLink } from 'components';
import { urlBuilder, useActiveRoute } from 'helpers';

import { tokenSelector } from 'redux/selectors';
import { tokensRoutes } from 'routes';

export const TokenTabs = () => {
  const activeRoute = useActiveRoute();

  const { identifier, assets, roles } = useSelector(tokenSelector);

  return (
    <div className='account-tabs d-flex flex-row'>
      <NetworkLink
        to={urlBuilder.tokenDetails(identifier)}
        className={`tab-link me-3 ${
          activeRoute(tokensRoutes.tokenDetails) ? 'active' : ''
        }`}
      >
        <h6>Transactions</h6>
      </NetworkLink>

      <NetworkLink
        to={urlBuilder.tokenDetailsAccounts(identifier)}
        className={`tab-link mx-3 ${
          activeRoute(tokensRoutes.tokenDetailsAccounts) ? 'active' : ''
        }`}
      >
        <h6>Accounts</h6>
      </NetworkLink>

      {assets?.lockedAccounts && (
        <NetworkLink
          to={urlBuilder.tokenDetailsLockedAccounts(identifier)}
          className={`tab-link mx-3 ${
            activeRoute(tokensRoutes.tokenDetailsLockedAccounts) ? 'active' : ''
          }`}
        >
          <h6>Locked Accounts</h6>
        </NetworkLink>
      )}

      {roles && (
        <NetworkLink
          to={urlBuilder.tokenDetailsRoles(identifier)}
          className={`tab-link mx-3 ${
            activeRoute(tokensRoutes.tokenDetailsRoles) ? 'active' : ''
          }`}
        >
          <h6>Roles</h6>
        </NetworkLink>
      )}
    </div>
  );
};
