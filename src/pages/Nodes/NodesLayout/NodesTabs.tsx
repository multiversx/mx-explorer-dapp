import * as React from 'react';
import { NetworkLink } from 'components';
import { useIsMainnet, useActiveRoute } from 'hooks';
import { validatorsRoutes } from 'routes';

export const NodesTabs = () => {
  const isMainnet = useIsMainnet();
  const activeRoute = useActiveRoute();

  return (
    <div className='card-header-item nodes-tabs mb-3'>
      <div className='tab-links d-flex flex-wrap gap-3'>
        {isMainnet && (
          <NetworkLink
            to={validatorsRoutes.identities}
            className={`tab-link ${
              activeRoute(validatorsRoutes.identities) ? 'active' : ''
            }`}
          >
            <h5>Validators</h5>
          </NetworkLink>
        )}

        <NetworkLink
          to={validatorsRoutes.providers}
          className={`tab-link ${
            activeRoute(validatorsRoutes.providers) ? 'active' : ''
          }`}
        >
          <h5>Staking Providers</h5>
        </NetworkLink>

        <NetworkLink
          to={validatorsRoutes.nodes}
          className={`tab-link ${
            activeRoute(validatorsRoutes.nodes) ? 'active' : ''
          }`}
        >
          <h5>Nodes</h5>
        </NetworkLink>

        <NetworkLink
          to={validatorsRoutes.statistics}
          className={`tab-link ${
            activeRoute(validatorsRoutes.statistics) ? 'active' : ''
          }`}
        >
          <h5>Statistics</h5>
        </NetworkLink>

        <NetworkLink
          to={validatorsRoutes.queue}
          className={`tab-link ${
            activeRoute(validatorsRoutes.queue) ? 'active' : ''
          }`}
        >
          <h5>Queue</h5>
        </NetworkLink>
      </div>
    </div>
  );
};
