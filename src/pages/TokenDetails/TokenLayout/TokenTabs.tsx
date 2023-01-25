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
    <div className='tab-links d-flex flex-row flex-wrap'>
      <NetworkLink
        to={urlBuilder.tokenDetails(identifier)}
        className={`tab-link me-3 me-lg-4 ${
          activeRoute(tokensRoutes.tokenDetails) ? 'active' : ''
        }`}
      >
        <h5>Transactions</h5>
      </NetworkLink>

      <NetworkLink
        to={urlBuilder.tokenDetailsAccounts(identifier)}
        className={`tab-link me-3 me-lg-4 ${
          activeRoute(tokensRoutes.tokenDetailsAccounts) ? 'active' : ''
        }`}
      >
        <h5>Accounts</h5>
      </NetworkLink>

      {assets?.lockedAccounts && (
        <NetworkLink
          to={urlBuilder.tokenDetailsLockedAccounts(identifier)}
          className={`tab-link me-3 me-lg-4 ${
            activeRoute(tokensRoutes.tokenDetailsLockedAccounts) ? 'active' : ''
          }`}
        >
          <h5>Locked Accounts</h5>
        </NetworkLink>
      )}

      {roles && (
        <NetworkLink
          to={urlBuilder.tokenDetailsRoles(identifier)}
          className={`tab-link me-3 me-lg-4 ${
            activeRoute(tokensRoutes.tokenDetailsRoles) ? 'active' : ''
          }`}
        >
          <h5>Roles</h5>
        </NetworkLink>
      )}
    </div>
  );
};
