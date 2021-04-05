import { useIsMainnet } from 'helpers';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { validatorsRoutes } from 'routes';
import { NetworkLink } from 'sharedComponents';

const NodesTabs = () => {
  const isMainnet = useIsMainnet();
  const activePath = useLocation().pathname;

  return (
    <div className="nodes-tabs card-header-item">
      <div className="d-flex">
        {isMainnet && (
          <NetworkLink
            to={validatorsRoutes.index}
            className={`tab-link mr-3 ${
              activePath.includes(validatorsRoutes.index) ? 'active' : ''
            }`}
          >
            <h6>Validators</h6>
          </NetworkLink>
        )}

        <NetworkLink
          to={validatorsRoutes.providers}
          className={`tab-link mx-3 ${
            activePath.includes(validatorsRoutes.providers) ? 'active' : ''
          }`}
        >
          <h6>Staking Providers</h6>
        </NetworkLink>

        <NetworkLink
          to={validatorsRoutes.nodes}
          className={`tab-link ml-3 ${activePath.includes(validatorsRoutes.nodes) ? 'active' : ''}`}
        >
          <h6>Nodes</h6>
        </NetworkLink>
      </div>
    </div>
  );
};

export default NodesTabs;
