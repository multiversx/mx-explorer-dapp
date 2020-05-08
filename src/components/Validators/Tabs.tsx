import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { validatorsRouteNames } from 'routes';
import { TestnetLink } from 'sharedComponents';

const Tabs = ({ extraClasses }: { extraClasses?: string }) => {
  const activePath = useLocation().pathname;
  const nodesPage =
    activePath.endsWith(validatorsRouteNames.validatorsNodes) ||
    activePath.endsWith(validatorsRouteNames.validatorsNodes + '/');

  const validatorsPage = !nodesPage;

  return (
    <div className={`pb-3 ${extraClasses}`}>
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
