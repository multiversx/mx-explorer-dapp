import React from 'react';
import { useActiveRoute } from 'helpers';
import { validatorsRoutes, accountsRoutes } from 'routes';
import NodesLayout from 'components/Nodes/NodesLayout';
import AccountLayout from 'components/AccountDetails/AccountLayout';
import ProviderLayout from 'components/ProviderDetails/ProviderLayout';

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
    case activeRoute(accountsRoutes.oldAccountDetails):
      return <AccountLayout>{children}</AccountLayout>;

    case activeRoute(validatorsRoutes.providerDetails):
    case activeRoute(validatorsRoutes.providerTransactions):
      return <ProviderLayout>{children}</ProviderLayout>;

    default:
      return <>{children}</>;
  }
}
