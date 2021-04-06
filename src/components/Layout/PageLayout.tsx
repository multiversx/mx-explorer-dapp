import React from 'react';
import { useMatchPath, useNetworkRoute } from 'helpers';
import { validatorsRoutes, accountRoutes, providerRoutes } from 'routes';
import NodesLayout from 'components/Nodes/NodesLayout';
import AccountLayout from 'components/AccountDetails/AccountLayout';
import ProviderLayout from 'components/ProviderDetails/ProviderLayout';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const networkRoute = useNetworkRoute();
  const matchPath = useMatchPath();

  switch (true) {
    case matchPath(networkRoute(validatorsRoutes.index)) !== null:
    case matchPath(networkRoute(validatorsRoutes.nodes)) !== null:
    case matchPath(networkRoute(validatorsRoutes.providers)) !== null:
      return <NodesLayout>{children}</NodesLayout>;

    case matchPath(networkRoute(accountRoutes.index)) !== null:
    case matchPath(networkRoute(accountRoutes.code)) !== null:
    case matchPath(networkRoute(accountRoutes.tokens)) !== null:
    case matchPath(networkRoute(accountRoutes.oldAccountDetails)) !== null:
      return <AccountLayout>{children}</AccountLayout>;

    case matchPath(networkRoute(providerRoutes.index)) !== null:
    case matchPath(networkRoute(providerRoutes.transactions)) !== null:
      return <ProviderLayout>{children}</ProviderLayout>;

    default:
      return <>{children}</>;
  }
}
