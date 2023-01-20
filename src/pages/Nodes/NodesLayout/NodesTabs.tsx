import { useIsMainnet, useActiveRoute } from 'helpers';
import * as React from 'react';
import { validatorsRoutes } from 'routes';
import { NetworkLink } from 'sharedComponents';

const NodesTabs = () => {
  const isMainnet = useIsMainnet();
  const activeRoute = useActiveRoute();

  return (
    <div className="nodes-tabs card-header-item">
      <div className="d-flex flex-wrap">
        {isMainnet && (
          <NetworkLink
            to={validatorsRoutes.identities}
            className={`tab-link mr-3 ${activeRoute(validatorsRoutes.identities) ? 'active' : ''}`}
          >
            <h6>Validators</h6>
          </NetworkLink>
        )}

        <NetworkLink
          to={validatorsRoutes.providers}
          className={`tab-link ${isMainnet ? 'mx-3' : 'mr-3'} ${
            activeRoute(validatorsRoutes.providers) ? 'active' : ''
          }`}
        >
          <h6>Staking Providers</h6>
        </NetworkLink>

        <NetworkLink
          to={validatorsRoutes.nodes}
          className={`tab-link mx-3 pr-3 pr-sm-0 ${
            activeRoute(validatorsRoutes.nodes) ? 'active' : ''
          }`}
        >
          <h6>Nodes</h6>
        </NetworkLink>

        <NetworkLink
          to={validatorsRoutes.statistics}
          className={`tab-link mx-3 pr-3 pr-sm-0 ${
            activeRoute(validatorsRoutes.statistics) ? 'active' : ''
          }`}
        >
          <h6>Statistics</h6>
        </NetworkLink>

        <NetworkLink
          to={validatorsRoutes.queue}
          className={`tab-link ml-0 ml-sm-3 ${activeRoute(validatorsRoutes.queue) ? 'active' : ''}`}
        >
          <h6>Queue</h6>
        </NetworkLink>
      </div>
    </div>
  );
};

export default NodesTabs;
