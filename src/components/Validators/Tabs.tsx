import * as React from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { validatorsRouteNames } from 'routes';
import { TestnetLink } from 'sharedComponents';

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
          <TestnetLink
            to={validatorsRouteNames.validators}
            className={`nav-link text-center ${validatorsPage ? 'active' : ''}`}
          >
            Validators
          </TestnetLink>
        </li>
        <li className="nav-item">
          <TestnetLink
            to={validatorsRouteNames.validatorsNodes}
            className={`nav-link text-center ${nodesPage ? 'active' : ''}`}
          >
            Nodes
          </TestnetLink>
        </li>
      </ul>
    </div>
  );
};

export default Tabs;
