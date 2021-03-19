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
          <>
            {activePath.includes(validatorsRoutes.index) ? (
              <div className="mr-3">
                <h6>Validators</h6>
              </div>
            ) : (
              <NetworkLink to={validatorsRoutes.index} className="tab-link mr-3">
                <h6>Validators</h6>
              </NetworkLink>
            )}
          </>
        )}

        {activePath.includes(validatorsRoutes.providers) ? (
          <div className="mx-3">
            <h6>Contracts</h6>
          </div>
        ) : (
          <NetworkLink to={validatorsRoutes.providers} className="tab-link mx-3">
            <h6>Contracts</h6>
          </NetworkLink>
        )}
        {activePath.includes(validatorsRoutes.nodes) ? (
          <div className="mx-3">
            <h6>Nodes</h6>
          </div>
        ) : (
          <NetworkLink to={validatorsRoutes.nodes} className="tab-link ml-3">
            <h6>Nodes</h6>
          </NetworkLink>
        )}
      </div>
    </div>
  );
};

export default NodesTabs;
