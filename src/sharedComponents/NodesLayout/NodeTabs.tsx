import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { validatorsRoutes } from 'routes';
import { NetworkLink } from 'sharedComponents';

const NodesTabs = () => {
  const activePath = useLocation().pathname;
  const nodesPage = activePath.includes(validatorsRoutes.nodes);

  const validatorsPage = !nodesPage;

  return (
    <div className="nodes-tabs card-header-item pb-0 px-0 border-0">
      <ul className="nav nav-tabs px-3 px-lg-spacer">
        <li className="nav-item">
          <NetworkLink
            to={validatorsRoutes.index}
            className={`nav-link text-center ${validatorsPage ? 'active' : ''}`}
          >
            Validators
          </NetworkLink>
        </li>
        <li className="nav-item">
          <NetworkLink
            to={validatorsRoutes.nodes}
            className={`nav-link text-center ${nodesPage ? 'active' : ''}`}
          >
            Nodes
          </NetworkLink>
        </li>
      </ul>
    </div>
  );
};

export default NodesTabs;
