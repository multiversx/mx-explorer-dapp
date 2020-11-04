import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { validatorsRoutes } from 'routes';
import { NetworkLink } from 'sharedComponents';

const Tabs = ({ extraClasses = '' }: { extraClasses?: string }) => {
  const activePath = useLocation().pathname;
  const nodesPage =
    activePath.endsWith(validatorsRoutes.nodes) ||
    activePath.endsWith(validatorsRoutes.nodes + '/');

  const validatorsPage = !nodesPage;

  return (
    <div className={extraClasses}>
      <ul className="validators-nav nav nav-tabs px-4">
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

export default Tabs;
