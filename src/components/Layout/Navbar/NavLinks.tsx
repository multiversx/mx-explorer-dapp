import React from 'react';
import { NetworkLink } from 'sharedComponents';
import { validatorsRoutes } from 'routes';
import { useNetworkRoute, useMatchPath, useIsMainnet } from 'helpers';

interface NavLinksType {
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavLinks({ setExpanded = () => null }: NavLinksType) {
  const networkRoute = useNetworkRoute();
  const matchPath = useMatchPath();
  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };
  const isMainnet = useIsMainnet();
  return (
    <>
      <NetworkLink
        className={`nav-link ${matchPath(networkRoute('/')) !== null ? 'active' : ''}`}
        to="/"
        onClick={() => onToggle(false)}
      >
        Dashboard
      </NetworkLink>
      <NetworkLink
        className={`nav-link ${matchPath(networkRoute('/blocks')) !== null ? 'active' : ''}`}
        to="/blocks"
        onClick={() => onToggle(false)}
      >
        Blocks
      </NetworkLink>

      <NetworkLink
        className={`nav-link ${matchPath(networkRoute('/transactions')) !== null ? 'active' : ''}`}
        to="/transactions"
        onClick={() => onToggle(false)}
      >
        Transactions
      </NetworkLink>

      <NetworkLink
        className={`nav-link ${
          matchPath(networkRoute(validatorsRoutes.nodes)) !== null ||
          matchPath(networkRoute(validatorsRoutes.index)) !== null
            ? 'active'
            : ''
        }`}
        to={isMainnet ? validatorsRoutes.index : validatorsRoutes.nodes}
        onClick={() => onToggle(false)}
      >
        Validators
      </NetworkLink>
    </>
  );
}
