import React from 'react';
import { NetworkLink } from 'sharedComponents';
import { validatorsRoutes } from 'routes';
import { useNetworkRoute, useMatchPath, useIsMainnet } from 'helpers';
import { useGlobalState } from 'context';
import { useLocation } from 'react-router-dom';

interface NavLinksType {
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavLinks({ setExpanded = () => null }: NavLinksType) {
  const networkRoute = useNetworkRoute();
  const matchPath = useMatchPath();
  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };
  const { activeNetwork } = useGlobalState();
  const activePath = useLocation().pathname;

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
        className={`nav-link ${
          matchPath(networkRoute('/blocks')) !== null || activePath.includes('/blocks/')
            ? 'active'
            : ''
        }`}
        to="/blocks"
        onClick={() => onToggle(false)}
      >
        Blocks
      </NetworkLink>

      <NetworkLink
        className={`nav-link ${
          matchPath(networkRoute('/transactions')) !== null || activePath.includes('/transactions/')
            ? 'active'
            : ''
        }`}
        to="/transactions"
        onClick={() => onToggle(false)}
      >
        Transactions
      </NetworkLink>

      <NetworkLink
        className={`nav-link ${
          matchPath(networkRoute('/accounts')) !== null || activePath.includes('/accounts/')
            ? 'active'
            : ''
        }`}
        to="/accounts"
        onClick={() => onToggle(false)}
      >
        Accounts
      </NetworkLink>

      <NetworkLink
        className={`nav-link ${
          matchPath(networkRoute(validatorsRoutes.index)) !== null ||
          matchPath(networkRoute(validatorsRoutes.providers)) !== null ||
          matchPath(networkRoute(validatorsRoutes.nodes)) !== null ||
          activePath.includes('/identities/') ||
          activePath.includes('/providers/') ||
          activePath.includes('/nodes/')
            ? 'active'
            : ''
        }`}
        to={isMainnet ? validatorsRoutes.index : validatorsRoutes.nodes}
        onClick={() => onToggle(false)}
      >
        Validators
      </NetworkLink>

      {activeNetwork.id !== 'mainnet' && activeNetwork.adapter === 'api' && (
        <NetworkLink
          className={`nav-link ${
            matchPath(networkRoute('/tokens')) !== null || activePath.includes('/tokens/')
              ? 'active'
              : ''
          }`}
          to="/tokens"
          onClick={() => onToggle(false)}
        >
          Tokens
        </NetworkLink>
      )}
    </>
  );
}
