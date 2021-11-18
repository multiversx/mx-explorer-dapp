import React from 'react';
import { useActiveRoute } from 'helpers';
import { validatorsRoutes, accountsRoutes, tokensRoutes } from 'routes';
import NodesLayout from 'components/Nodes/NodesLayout';
import AccountLayout from 'components/AccountDetails/AccountLayout';
import ProviderLayout from 'components/ProviderDetails/ProviderLayout';
import TokenLayout from 'components/TokenDetails/TokenLayout';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(validatorsRoutes.identities):
    case activeRoute(validatorsRoutes.nodes):
    case activeRoute(validatorsRoutes.providers):
    case activeRoute(validatorsRoutes.statistics):
    case activeRoute(validatorsRoutes.queue):
      return <NodesLayout>{children}</NodesLayout>;

    case activeRoute(accountsRoutes.accountDetails):
    case activeRoute(accountsRoutes.accountCode):
    case activeRoute(accountsRoutes.accountTokens):
    case activeRoute(accountsRoutes.accountNfts):
    case activeRoute(accountsRoutes.accountScResults):
    case activeRoute(accountsRoutes.oldAccountDetails):
      return <AccountLayout>{children}</AccountLayout>;

    case activeRoute(tokensRoutes.tokenDetails):
    case activeRoute(tokensRoutes.tokenDetailsAccounts):
      return <TokenLayout>{children}</TokenLayout>;

    case activeRoute(validatorsRoutes.providerDetails):
    case activeRoute(validatorsRoutes.providerTransactions):
      return <ProviderLayout>{children}</ProviderLayout>;

    default:
      return <>{children}</>;
  }
}
