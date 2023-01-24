import React from 'react';
import { useSelector } from 'react-redux';
import { NetworkLink } from 'components';
import { useIsMainnet, useActiveRoute } from 'helpers';

import { activeNetworkSelector } from 'redux/selectors';
import {
  blocksRoutes,
  transactionsRoutes,
  accountsRoutes,
  validatorsRoutes,
  tokensRoutes,
  nftRoutes,
  collectionRoutes,
  analyticsRoutes
} from 'routes';

interface NavLinksType {
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavLinks = ({ setExpanded = () => null }: NavLinksType) => {
  const activeRoute = useActiveRoute();

  const { adapter } = useSelector(activeNetworkSelector);

  const isMainnet = useIsMainnet();

  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <>
      <NetworkLink
        className={`nav-link ${activeRoute('/') ? 'active' : ''}`}
        to='/'
        onClick={() => onToggle(false)}
      >
        Dashboard
      </NetworkLink>
      <NetworkLink
        className={`nav-link ${
          activeRoute(blocksRoutes.blocks) ||
          activeRoute(blocksRoutes.blocksDetails) ||
          activeRoute(blocksRoutes.miniBlockDetails)
            ? 'active'
            : ''
        }`}
        to={blocksRoutes.blocks}
        onClick={() => onToggle(false)}
      >
        Blocks
      </NetworkLink>

      <NetworkLink
        className={`nav-link ${
          activeRoute(transactionsRoutes.transactions) ||
          activeRoute(transactionsRoutes.transactionDetails)
            ? 'active'
            : ''
        }`}
        to={transactionsRoutes.transactions}
        onClick={() => onToggle(false)}
      >
        Transactions
      </NetworkLink>

      <NetworkLink
        className={`nav-link ${
          activeRoute(accountsRoutes.accounts) ||
          activeRoute(accountsRoutes.accountDetails) ||
          activeRoute(accountsRoutes.accountCode) ||
          activeRoute(accountsRoutes.accountTokens) ||
          activeRoute(accountsRoutes.accountNfts) ||
          activeRoute(accountsRoutes.accountContracts) ||
          activeRoute(accountsRoutes.accountScResults)
            ? 'active'
            : ''
        }`}
        to={accountsRoutes.accounts}
        onClick={() => onToggle(false)}
      >
        Accounts
      </NetworkLink>

      {adapter === 'api' && (
        <>
          <NetworkLink
            className={`nav-link ${
              activeRoute(tokensRoutes.tokens) ||
              activeRoute(tokensRoutes.tokenDetails) ||
              activeRoute(tokensRoutes.tokenDetailsAccounts) ||
              activeRoute(tokensRoutes.tokenDetailsLockedAccounts) ||
              activeRoute(tokensRoutes.tokenDetailsRoles) ||
              activeRoute(tokensRoutes.tokensMeta)
                ? 'active'
                : ''
            }`}
            to={tokensRoutes.tokens}
            onClick={() => onToggle(false)}
          >
            Tokens
          </NetworkLink>

          <NetworkLink
            className={`nav-link ${
              activeRoute(collectionRoutes.collections) ||
              activeRoute(collectionRoutes.collectionDetails) ||
              activeRoute(nftRoutes.nfts) ||
              activeRoute(nftRoutes.nftDetails)
                ? 'active'
                : ''
            }`}
            to={collectionRoutes.collections}
            onClick={() => onToggle(false)}
          >
            NFTs
          </NetworkLink>

          <NetworkLink
            className={`nav-link ${
              activeRoute(validatorsRoutes.identities) ||
              activeRoute(validatorsRoutes.identityDetails) ||
              activeRoute(validatorsRoutes.providers) ||
              activeRoute(validatorsRoutes.providerDetails) ||
              activeRoute(validatorsRoutes.providerTransactions) ||
              activeRoute(validatorsRoutes.nodes) ||
              activeRoute(validatorsRoutes.nodeDetails)
                ? 'active'
                : ''
            }`}
            to={
              isMainnet ? validatorsRoutes.identities : validatorsRoutes.nodes
            }
            onClick={() => onToggle(false)}
          >
            Validators
          </NetworkLink>

          {isMainnet && (
            <NetworkLink
              className={`nav-link ${
                activeRoute(analyticsRoutes.analytics) ? 'active' : ''
              }`}
              to={analyticsRoutes.analytics}
              onClick={() => onToggle(false)}
            >
              Analytics
            </NetworkLink>
          )}
        </>
      )}
    </>
  );
};
