import * as React from 'react';
import { NetworkLink } from 'components';
import { useIsMainnet, useActiveRoute } from 'helpers';
import { validatorsRoutes } from 'routes';

export const NodesTabs = () => {
  const isMainnet = useIsMainnet();
  const activeRoute = useActiveRoute();

  return (
    <div className='nodes-tabs card-header-item'>
      <div className='tab-links d-flex flex-wrap'>
        {isMainnet && (
          <NetworkLink
            to={validatorsRoutes.identities}
            className={`tab-link me-3 ${
              activeRoute(validatorsRoutes.identities) ? 'active' : ''
            }`}
          >
            <h5>Validators</h5>
          </NetworkLink>
        )}

        <NetworkLink
          to={validatorsRoutes.providers}
          className={`tab-link ${isMainnet ? 'mx-3' : 'me-3'} ${
            activeRoute(validatorsRoutes.providers) ? 'active' : ''
          }`}
        >
          <h5>Staking Providers</h5>
        </NetworkLink>

        <NetworkLink
          to={validatorsRoutes.nodes}
          className={`tab-link mx-3 pe-3 pe-sm-0 ${
            activeRoute(validatorsRoutes.nodes) ? 'active' : ''
          }`}
        >
          <h5>Nodes</h5>
        </NetworkLink>

        <NetworkLink
          to={validatorsRoutes.statistics}
          className={`tab-link mx-3 pe-3 pe-sm-0 ${
            activeRoute(validatorsRoutes.statistics) ? 'active' : ''
          }`}
        >
          <h5>Statistics</h5>
        </NetworkLink>

        <NetworkLink
          to={validatorsRoutes.queue}
          className={`tab-link ms-0 ms-sm-3 ${
            activeRoute(validatorsRoutes.queue) ? 'active' : ''
          }`}
        >
          <h5>Queue</h5>
        </NetworkLink>
      </div>
    </div>
  );
};
