import * as React from 'react';
import { useSelector } from 'react-redux';
import { NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { useActiveRoute } from 'hooks';

import { tokenSelector } from 'redux/selectors';
import { tokensRoutes } from 'routes';

export const TokenTabs = () => {
  const activeRoute = useActiveRoute();

  const { token } = useSelector(tokenSelector);
  const { identifier, assets, roles } = token;

  return (
    <div className='tab-links d-flex flex-row flex-wrap gap-3'>
      <NetworkLink
        to={urlBuilder.tokenDetails(identifier)}
        className={`tab-link ${
          activeRoute(tokensRoutes.tokenDetails) ? 'active' : ''
        }`}
      >
        <h5>Transactions</h5>
      </NetworkLink>

      <NetworkLink
        to={urlBuilder.tokenDetailsAccounts(identifier)}
        className={`tab-link ${
          activeRoute(tokensRoutes.tokenDetailsAccounts) ? 'active' : ''
        }`}
      >
        <h5>Accounts</h5>
      </NetworkLink>

      {assets?.lockedAccounts && (
        <NetworkLink
          to={urlBuilder.tokenDetailsLockedAccounts(identifier)}
          className={`tab-link ${
            activeRoute(tokensRoutes.tokenDetailsLockedAccounts) ? 'active' : ''
          }`}
        >
          <h5>Locked Accounts</h5>
        </NetworkLink>
      )}

      {roles && (
        <NetworkLink
          to={urlBuilder.tokenDetailsRoles(identifier)}
          className={`tab-link ${
            activeRoute(tokensRoutes.tokenDetailsRoles) ? 'active' : ''
          }`}
        >
          <h5>Roles</h5>
        </NetworkLink>
      )}
    </div>
  );
};
