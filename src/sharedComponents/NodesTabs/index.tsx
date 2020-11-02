import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { NetworkLink } from 'sharedComponents';

const NodesTabs = ({ className }: { className?: string }) => {
  const activePath = useLocation().pathname;
  const nodesPage = activePath.endsWith('/nodes') || activePath.endsWith('/nodes/');

  const validatorsPage = !nodesPage;

  return (
    <div className={className ? className : ''}>
      <ul className="validators-nav nav nav-tabs">
        <li className="nav-item">
          <NetworkLink
            to={'/validators'}
            className={`nav-link text-center ${validatorsPage ? 'active' : ''}`}
          >
            Validators
          </NetworkLink>
        </li>
        <li className="nav-item">
          <NetworkLink
            to={'/nodes'}
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
