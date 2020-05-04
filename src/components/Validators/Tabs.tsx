import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { validatorsRouteNames } from 'routes';

const Tabs = () => {
  const activePath = useLocation().pathname;

  const validatorsPage =
    activePath === validatorsRouteNames.validators ||
    activePath === validatorsRouteNames.validators + '/';

  const nodesPage =
    activePath === validatorsRouteNames.validatorsNodes ||
    activePath === validatorsRouteNames.validatorsNodes + '/';

  return (
    <div className={nodesPage ? 'pb-3' : ''}>
      <ul className="validators-nav nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link text-center ${validatorsPage ? 'active' : ''}`}
            href={validatorsRouteNames.validators}
          >
            Validators
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link text-center ${nodesPage ? 'active' : ''}`}
            href={validatorsRouteNames.validatorsNodes}
          >
            Nodes
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Tabs;
