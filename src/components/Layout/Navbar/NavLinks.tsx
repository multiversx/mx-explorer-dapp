import React from 'react';
import { NetworkLink } from 'sharedComponents';
import {
  blocksRoutes,
  transactionsRoutes,
  accountsRoutes,
  validatorsRoutes,
  tokensRoutes,
  nftRoutes,
} from 'routes';
import { useIsMainnet, useActiveRoute } from 'helpers';
import { useGlobalState } from 'context';

interface NavLinksType {
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavLinks({ setExpanded = () => null }: NavLinksType) {
  const activeRoute = useActiveRoute();
  const { activeNetwork } = useGlobalState();
  const isMainnet = useIsMainnet();

  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <>
      <NetworkLink
        className={`nav-link ${activeRoute('/') ? 'active' : ''}`}
        to="/"
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
          activeRoute(accountsRoutes.accountNfts)
            ? 'active'
            : ''
        }`}
        to={accountsRoutes.accounts}
        onClick={() => onToggle(false)}
      >
        Accounts
      </NetworkLink>

      {activeNetwork.adapter === 'api' && (
        <>
          <NetworkLink
            className={`nav-link ${
              activeRoute(tokensRoutes.tokens) ||
              activeRoute(tokensRoutes.tokenDetails) ||
              activeRoute(tokensRoutes.tokenDetailsAccounts)
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
              activeRoute(nftRoutes.nfts) || activeRoute(nftRoutes.nftDetails) ? 'active' : ''
            }`}
            to={nftRoutes.nfts}
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
            to={isMainnet ? validatorsRoutes.identities : validatorsRoutes.nodes}
            onClick={() => onToggle(false)}
          >
            Validators
          </NetworkLink>
        </>
      )}
    </>
  );
}
