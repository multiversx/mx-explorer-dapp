import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { validatorsRoutes } from 'routes';
import { NetworkLink } from 'sharedComponents';

const NodesTabs = ({ children }: { children?: React.ReactNode }) => {
  const activePath = useLocation().pathname;

  return (
    <div className="nodes-tabs card-header-item">
      <div className="d-flex flex-column flex-md-row align-items-md-center">
        <div>
          <NetworkLink
            to={validatorsRoutes.index}
            className={`tab-link mr-3 ${
              activePath.includes(validatorsRoutes.index) ? 'active' : ''
            }`}
          >
            <h6>Validators</h6>
          </NetworkLink>
        </div>
        <div>
          <NetworkLink
            to={validatorsRoutes.providers}
            className={`tab-link mx-3 ${
              activePath.includes(validatorsRoutes.providers) ? 'active' : ''
            }`}
          >
            <h6>Contracts</h6>
          </NetworkLink>
        </div>
        <div>
          <NetworkLink
            to={validatorsRoutes.nodes}
            className={`tab-link ml-3 ${
              activePath.includes(validatorsRoutes.nodes) ? 'active' : ''
            }`}
          >
            <h6>Nodes</h6>
          </NetworkLink>
        </div>
        {children && <div className="ml-auto">{children}</div>}
      </div>
    </div>
  );
};

export default NodesTabs;
